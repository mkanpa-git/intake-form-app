const express = require('express');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const router = express.Router();

const registrationsDir = path.join(__dirname, '../data/autofill');
fs.mkdirSync(registrationsDir, { recursive: true });

router.post('/api/common-intake/autofill/register', (req, res) => {
  try {
    const payload = req.body || {};
    if (!payload.id) {
      return res.status(400).json({ error: 'Missing id' });
    }
    const filePath = path.join(registrationsDir, `${payload.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(payload, null, 2));
    res.json({ status: 'registered', id: payload.id });
  } catch (err) {
    console.error('Registration save failed:', err);
    res.status(500).json({ error: 'Failed to register configuration' });
  }
});

// Helper to obtain OAuth2 access tokens for the given scope
async function getAccessToken(scope) {
  const tokenUrl = process.env.OAUTH_TOKEN_URL;
  const clientId = process.env.OAUTH_CLIENT_ID;
  const clientSecret = process.env.OAUTH_CLIENT_SECRET;

  if (!tokenUrl || !clientId || !clientSecret) {
    throw new Error('OAuth credentials not configured');
  }

  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    scope,
  });

  const resp = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: body.toString(),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Token request failed: ${resp.status} ${text}`);
  }

  const data = await resp.json();
  return data.access_token;
}

// Fetch the most recently registered autofill configuration
router.get('/api/autofill/config', (req, res) => {
  try {
    const files = fs
      .readdirSync(registrationsDir)
      .filter((f) => f.endsWith('.json'));
    const configs = files.map((f) => {
      const contents = fs.readFileSync(path.join(registrationsDir, f), 'utf8');
      return JSON.parse(contents);
    });
    res.json(configs);
  } catch (err) {
    console.error('Failed to read autofill config:', err);
    res.status(500).json({ error: 'Failed to read autofill configuration' });
  }
});

// Proxy to the Profile API for core business profile information
router.get('/api/profile/business/:businessId', async (req, res) => {
  try {
    const token = await getAccessToken('profile.core.read');
    const base = process.env.PROFILE_API_BASE_URL || '';
    const url = `${base}/api/profile/business/${encodeURIComponent(req.params.businessId)}`;
    const resp = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await resp.json();
    res.status(resp.status).json(data);
  } catch (err) {
    console.error('Profile core fetch failed:', err);
    res.status(500).json({ error: 'Failed to fetch business profile' });
  }
});

// Retrieve extended business profile information
router.get('/api/profile/business/:businessId/extended', async (req, res) => {
  try {
    const token = await getAccessToken('profile.extended.read');
    const base = process.env.PROFILE_API_BASE_URL || '';
    const url = `${base}/api/profile/business/${encodeURIComponent(req.params.businessId)}/extended`;
    const resp = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await resp.json();
    res.status(resp.status).json(data);
  } catch (err) {
    console.error('Profile extended fetch failed:', err);
    res.status(500).json({ error: 'Failed to fetch extended business profile' });
  }
});

// Save extended business profile data
router.post('/api/profile/business/:businessId/extended', async (req, res) => {
  try {
    const token = await getAccessToken('profile.extended.write');
    const base = process.env.PROFILE_API_BASE_URL || '';
    const url = `${base}/api/profile/business/${encodeURIComponent(req.params.businessId)}/extended`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(req.body || {}),
    });
    const data = await resp.json();
    res.status(resp.status).json(data);
  } catch (err) {
    console.error('Profile extended save failed:', err);
    res.status(500).json({ error: 'Failed to save extended business profile' });
  }
});

module.exports = router;
