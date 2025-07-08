require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const createStorageStrategy = require('./storage');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pgSession = require('connect-pg-simple')(session);
const helmet = require('helmet');
const csurf = require('csurf');
const rateLimit = require('express-rate-limit');
const pool = require('./db');
const authRoutes = require('./routes/auth');
const applicationsRoutes = require('./routes/applications');
const placesRoutes = require('./routes/places');
const { getApplications, getApplication } = applicationsRoutes;

const app = express();
const PORT = process.env.PORT || 5000;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
console.log(
  GOOGLE_API_KEY
    ? 'Google API Key is set'
    : '❌ Google API Key is NOT set! Please set it in .env file',
);

const storage = createStorageStrategy({
  uploadsDir: path.join(__dirname, 'uploads'),
});

app.use(
  session({
    store: new pgSession({ pool }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);

// Security middleware
app.use(helmet());

app.use(passport.initialize());
app.use(passport.session());
// Middleware to parse JSON bodies
app.use(express.json());
if ((process.env.FILE_STORAGE || 'LOCAL').toUpperCase() !== 'GCP') {
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
}
app.use(express.urlencoded({ extended: true }));
app.use(csurf());
app.use((req, res, next) => {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  next();
});
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL, //'/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails && profile.emails[0].value;
        const first = profile.name.givenName || '';
        const middle = profile.name.middleName
          ? profile.name.middleName[0]
          : null;
        const last = profile.name.familyName || '';

        let res = await pool.query(
          'SELECT * FROM users WHERE provider = $1 AND provider_id = $2',
          ['google', profile.id],
        );
        let user = res.rows[0];
        if (!user) {
          res = await pool.query(
            'INSERT INTO users (provider, provider_id, email, first_name, middle_initial, last_name) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
            ['google', profile.id, email, first, middle, last],
          );
          user = res.rows[0];
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  ),
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

app.use(authRoutes);

const upload = storage.multerMiddleware();

// --- File Upload ---
app.post('/api/applications/:appId/upload', upload, async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }
  try {
    const paths = await storage.saveFiles(req.params.appId, req.files);
    res.json({ paths });
  } catch (err) {
    console.error(err);
    if (err.code === 'VIRUS_DETECTED') {
      return res.status(400).json({ error: 'Malicious file detected' });
    }
    res.status(500).json({ error: 'Failed to store files' });
  }
});

app.use(placesRoutes);
app.use(applicationsRoutes);

// --- Help Chat ---
const chatLimiter = rateLimit({ windowMs: 60 * 1000, max: 5 });
app.post('/api/help-chat', chatLimiter, async (req, res) => {
  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OpenAI key not configured' });
  }
  try {
    const { message, history = [], context = {} } = req.body || {};
    const { stepTitle, fields = [], errors = [] } = context;

    let contextText = '';
    if (stepTitle) {
      contextText += `Current step: ${stepTitle}\n`;
    }
    if (fields.length) {
      const fieldDesc = fields
        .map(
          (f) =>
            `${f.label}${f.tooltip ? ' - ' + f.tooltip : ''}${f.description ? ' - ' + f.description : ''}`,
        )
        .join('\n');
      contextText += `Fields:\n${fieldDesc}\n`;
    }
    if (errors.length) {
      const errText = errors.map((e) => e.msg).join('\n');
      contextText += `Validation errors:\n${errText}\n`;
    }

    const systemPrompt =
      'You are a helpful assistant for the intake form application. Provide concise guidance, using the context below.' +
      '\nRespond in the following format:\nANSWER: <text>\nSUGGESTIONS:\n- <suggestion1>\n- <suggestion2>\n- <suggestion3>';

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'system', content: contextText },
      ...history,
      { role: 'user', content: message },
    ];

    const apiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0.2,
      }),
    });
    const data = await apiRes.json();
    if (!apiRes.ok) {
      console.error('OpenAI error', data);
      return res.status(500).json({ error: 'OpenAI request failed' });
    }
    let reply =
      data.choices &&
      data.choices[0] &&
      data.choices[0].message &&
      data.choices[0].message.content;
    let suggestions = [];
    if (reply) {
      const parts = reply.split(/SUGGESTIONS:/i);
      reply = parts[0].replace(/^ANSWER:/i, '').trim();
      if (parts[1]) {
        suggestions = parts[1]
          .split('\n')
          .map((s) => s.replace(/^[-*]\s*/, '').trim())
          .filter(Boolean)
          .slice(0, 3);
      }
    }
    res.json({ reply, suggestions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Request failed' });
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

// CSRF error handler
app.use((err, req, res, next) => {
  if (err.code !== 'EBADCSRFTOKEN') return next(err);
  res.status(403).send('Invalid CSRF token');
});

app.use((err, req, res, next) => {
  console.error('OAuth error:', err?.message);
  console.error('Google response:', err?.oauthError?.data || err);
  res.status(500).send('OAuth callback failed');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
