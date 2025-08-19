const express = require('express');
const fs = require('fs');
const path = require('path');

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

module.exports = router;
