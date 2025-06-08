require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 5000;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

// Middleware to parse JSON bodies
app.use(express.json());

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
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch place details' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
