require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 5000;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

app.get('/api/places/autocomplete', async (req, res) => {
  const input = req.query.input;
  const sessiontoken = req.query.sessiontoken;
  if (!input) {
    return res.status(400).json({ error: 'Missing input parameter' });
  }
  try {
    const url = `https://places.googleapis.com/v1/places:autocomplete?input=${encodeURIComponent(input)}&languageCode=en`;
    const headers = {
      'X-Goog-Api-Key': GOOGLE_API_KEY,
      'X-Goog-FieldMask': 'places.placeId,places.formattedAddress,places.displayName',
    };
    if (sessiontoken) headers['X-Goog-Session-Token'] = sessiontoken;
    const response = await fetch(url, { headers });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch autocomplete results' });
  }
});

app.get('/api/places/details/:id', async (req, res) => {
  const placeId = req.params.id;
  const sessiontoken = req.query.sessiontoken;
  try {
    const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=en`;
    const headers = {
      'X-Goog-Api-Key': GOOGLE_API_KEY,
      'X-Goog-FieldMask': 'id,displayName,formattedAddress,addressComponents',
    };
    if (sessiontoken) headers['X-Goog-Session-Token'] = sessiontoken;
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
