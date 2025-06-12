require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const fetch = require('node-fetch');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
console.log (GOOGLE_API_KEY ? 'Google API Key is set' : '❌ Google API Key is NOT set! Please set it in .env file');
// Middleware to parse JSON bodies
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

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
function loadApplications() {
  try {
    const raw = fs.readFileSync(path.join(__dirname, 'data', 'applications.json'));
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveApplications(apps) {
  const file = path.join(__dirname, 'data', 'applications.json');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(apps, null, 2));
}

// --- Application API ---
app.post('/api/applications/:appId', (req, res) => {
  const apps = loadApplications();
  const idx = apps.findIndex((a) => a.id === req.params.appId);
  const record = { id: req.params.appId, ...req.body, updatedAt: new Date().toISOString() };
  if (idx !== -1) {
    apps[idx] = { ...apps[idx], ...record };
  } else {
    apps.push(record);
  }
  saveApplications(apps);
  res.json({ status: 'ok' });
});

app.get('/api/applications', (req, res) => {
  res.json(loadApplications());
});

app.get('/api/applications/:appId', (req, res) => {
  const appData = loadApplications().find((a) => a.id === req.params.appId);
  if (!appData) return res.status(404).json({ error: 'Not found' });
  res.json(appData);
});

// --- Case Management UI ---
app.get('/cases', (req, res) => {
  const apps = loadApplications();
  res.render('applications', { apps });
});

app.get('/cases/:appId', (req, res) => {
  const appData = loadApplications().find((a) => a.id === req.params.appId);
  if (!appData) return res.status(404).send('Application not found');
  res.render('application', { app: appData });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
