require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const fetch = require('node-fetch');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pgSession = require('connect-pg-simple')(session);
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
console.log (GOOGLE_API_KEY ? 'Google API Key is set' : '❌ Google API Key is NOT set! Please set it in .env file');

app.use(session({
  store: new pgSession({ pool }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
// Middleware to parse JSON bodies
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails && profile.emails[0].value;
        const first = profile.name.givenName || '';
        const middle = profile.name.middleName ? profile.name.middleName[0] : null;
        const last = profile.name.familyName || '';

        let res = await pool.query('SELECT * FROM users WHERE provider = $1 AND provider_id = $2', ['google', profile.id]);
        let user = res.rows[0];
        if (!user) {
          res = await pool.query(
            'INSERT INTO users (provider, provider_id, email, first_name, middle_initial, last_name) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
            ['google', profile.id, email, first, middle, last]
          );
          user = res.rows[0];
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const res = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, res.rows[0]);
  } catch (err) {
    done(err);
  }
});

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/login', (req, res) => res.redirect('/auth/google'));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: 'http://localhost:3000/' }), // Also update failure redirect for consistency
  (req, res) => {
    // Redirect to the frontend application
    res.redirect('http://localhost:3000/');
  }
);

app.get('/auth/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    // Destroy session and redirect to the frontend application
    req.session.destroy(() => res.redirect('http://localhost:3000/'));
  });
});

app.get('/api/me', (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  res.json(req.user);
});

app.put('/api/me', async (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const { first_name, middle_initial, last_name } = req.body;
  try {
    const result = await pool.query(
      'UPDATE users SET first_name=$1, middle_initial=$2, last_name=$3 WHERE id=$4 RETURNING *',
      [first_name, middle_initial, last_name, req.user.id]
    );
    req.user = result.rows[0];
    res.json(req.user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = path.join(__dirname, 'uploads', req.params.appId);
      fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    },
  }),
});

// --- File Upload ---
app.post('/api/applications/:appId/upload', upload.array('files'), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }
  const paths = req.files.map((f) => `/uploads/${req.params.appId}/${f.filename}`);
  res.json({ paths });
});

// --- Autocomplete (Google Places API v1 expects POST with JSON body) ---
app.get('/api/places/autocomplete', async (req, res) => {
  const input = req.query.input;
  const sessiontoken = req.query.sessiontoken;

  console.log(`[Autocomplete] Incoming request:`);
  console.log(`→ Query input: ${input}`);
  console.log(`→ Session token: ${sessiontoken}`);
  console.log(`→ Headers:`, req.headers);

  if (!input) {
    return res.status(400).json({ error: 'Missing input parameter' });
  }

  try {
    const url = `https://places.googleapis.com/v1/places:autocomplete`;
    const body = JSON.stringify({
      input,
      languageCode: 'en'
    });

    const headers = {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': GOOGLE_API_KEY,
      'X-Goog-FieldMask': 'suggestions.placePrediction.text,suggestions.placePrediction.placeId'
    };
    if (sessiontoken) headers['X-Goog-Session-Token'] = sessiontoken;

    console.log(`↳ Fetching from: ${url}`);
    console.log(`↳ With headers:`, { ...headers, 'X-Goog-Api-Key': headers['X-Goog-Api-Key'] ? '***' : '❌ undefined' });
    console.log(`↳ With body:`, body);

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body
    });

    const data = await response.json();
    if (data.error) {
      console.error(`❌ Google API Error:`);
      console.error(`→ Status: ${data.error.status}`);
      console.error(`→ Message: ${data.error.message}`);
      console.error(`→ Full error object:\n`, JSON.stringify(data.error, null, 2));
      if (Array.isArray(data.error.details)) {
        console.error(`→ Error details:\n`, JSON.stringify(data.error.details[0], null, 2));
      }
    } else {
      console.log(`✅ Response data:`, JSON.stringify(data, null, 2));
    }
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch autocomplete results' });
  }
});

// --- Place Details (still GET) ---
app.get('/api/places/details/:id', async (req, res) => {
  console.log(`[Place Details] Incoming request:`);
  console.log(`→ Place ID: ${req.params.id}`);
  console.log(`→ Session token: ${req.query.sessiontoken}`);
  console.log(`→ Headers:`, req.headers);

  const placeId = req.params.id;
  const sessiontoken = req.query.sessiontoken;

  try {
    const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=en`;

    const headers = {
      'X-Goog-Api-Key': GOOGLE_API_KEY,
      'X-Goog-FieldMask': 'id,displayName,formattedAddress,addressComponents,location',
    };
    if (sessiontoken) headers['X-Goog-Session-Token'] = sessiontoken;

    console.log(`↳ Fetching from: ${url}`);
    console.log(`↳ With headers:`, { ...headers, 'X-Goog-Api-Key': headers['X-Goog-Api-Key'] ? '***' : '❌ undefined' });

    const response = await fetch(url, { headers });
    const data = await response.json();
    // ✅ Log the response body
    console.log(`✅ Place Details Response:`, JSON.stringify(data, null, 2));

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch place details' });
  }
});

// ------- Application Storage Helpers -------
async function getApplications() {
  const res = await pool.query('SELECT * FROM applications ORDER BY updated_at DESC');
  return res.rows;
}

async function getApplication(id) {
  const res = await pool.query('SELECT * FROM applications WHERE id = $1', [id]);
  return res.rows[0];
}

async function upsertApplication(id, data) {
  const {
    userId = null,
    serviceKey = 'childcare',
    status = 'draft',
    currentStep = 0,
    stepData = {},
    allData = {},
  } = data;
  await pool.query(
    `INSERT INTO applications (id, user_id, service_key, status, current_step, step_data, all_data)
     VALUES ($1,$2,$3,$4,$5,$6,$7)
     ON CONFLICT (id) DO UPDATE SET
       user_id = EXCLUDED.user_id,
       service_key = EXCLUDED.service_key,
       status = EXCLUDED.status,
       current_step = EXCLUDED.current_step,
       step_data = EXCLUDED.step_data,
       all_data = EXCLUDED.all_data,
       updated_at = NOW()`,
    [id, userId, serviceKey, status, currentStep, stepData, allData]
  );
}

// --- Application API ---
app.post('/api/applications/:appId', async (req, res) => {
  try {
    await upsertApplication(req.params.appId, req.body);
    res.json({ status: 'ok' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save application' });
  }
});

app.get('/api/applications', async (req, res) => {
  try {
    const apps = await getApplications();
    res.json(apps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load applications' });
  }
});

app.get('/api/applications/:appId', async (req, res) => {
  try {
    const appData = await getApplication(req.params.appId);
    if (!appData) return res.status(404).json({ error: 'Not found' });
    res.json(appData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load application' });
  }
});

app.delete('/api/applications/:appId', async (req, res) => {
  try {
    await pool.query('DELETE FROM applications WHERE id = $1', [req.params.appId]);
    res.json({ status: 'ok' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete application' });
  }
});

// --- Case Management UI ---
app.get('/cases', async (req, res) => {
  const apps = await getApplications();
  res.render('applications', { apps });
});

app.get('/cases/:appId', async (req, res) => {
  const appData = await getApplication(req.params.appId);
  if (!appData) return res.status(404).send('Application not found');
  res.render('application', { app: appData });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
