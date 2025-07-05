const express = require('express');
const fetch = require('node-fetch');
const crypto = require('crypto');
const logger = require('../logger');

const IS_PROD = process.env.NODE_ENV === 'production';

function getSafeHeaders(headers) {
  const { cookie, authorization, ...rest } = headers;
  return rest;
}

const router = express.Router();
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

router.get('/api/places/autocomplete', async (req, res) => {
  const reqId = crypto.randomUUID();
  const input = req.query.input;
  const sessiontoken = req.query.sessiontoken;

  logger.info('[Autocomplete] request received', { reqId });
  if (!IS_PROD) {
    logger.debug('[Autocomplete] request details', {
      reqId,
      input,
      sessiontoken,
      headers: getSafeHeaders(req.headers),
    });
  }

  if (!input) {
    logger.warn('Missing input parameter', { reqId });
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

    logger.debug('Requesting Google Places autocomplete', { reqId });

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body
    });

    const data = await response.json();
    if (data.error) {
      logger.error('Google API error', { reqId, status: data.error.status, message: data.error.message });
    }
    res.json(data);
    logger.info('Autocomplete response sent', { reqId, statusCode: res.statusCode });
  } catch (err) {
    logger.error(err.message, { reqId });
    res.status(500).json({ error: 'Failed to fetch autocomplete results' });
  }
});

router.get('/api/places/details/:id', async (req, res) => {
  const reqId = crypto.randomUUID();
  logger.info('[Place Details] request received', { reqId });

  const placeId = req.params.id;
  const sessiontoken = req.query.sessiontoken;
  if (!IS_PROD) {
    logger.debug('[Place Details] request details', {
      reqId,
      placeId,
      sessiontoken,
      headers: getSafeHeaders(req.headers),
    });
  }

  try {
    const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=en`;

    const headers = {
      'X-Goog-Api-Key': GOOGLE_API_KEY,
      'X-Goog-FieldMask': 'id,displayName,formattedAddress,addressComponents,location',
    };
    if (sessiontoken) headers['X-Goog-Session-Token'] = sessiontoken;

    logger.debug('Requesting Google Place details', { reqId });

    const response = await fetch(url, { headers });
    const data = await response.json();

    res.json(data);
    logger.info('Place details response sent', { reqId, statusCode: res.statusCode });
  } catch (err) {
    logger.error(err.message, { reqId });
    res.status(500).json({ error: 'Failed to fetch place details' });
  }
});

module.exports = router;
