const express = require('express');
const pool = require('../db');

const router = express.Router();

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

router.post('/api/applications/:appId', async (req, res) => {
  try {
    await upsertApplication(req.params.appId, req.body);
    res.json({ status: 'ok' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save application' });
  }
});

router.get('/api/applications', async (req, res) => {
  try {
    const apps = await getApplications();
    res.json(apps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load applications' });
  }
});

router.get('/api/applications/:appId', async (req, res) => {
  try {
    const appData = await getApplication(req.params.appId);
    if (!appData) return res.status(404).json({ error: 'Not found' });
    res.json(appData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load application' });
  }
});

router.delete('/api/applications/:appId', async (req, res) => {
  try {
    await pool.query('DELETE FROM applications WHERE id = $1', [req.params.appId]);
    res.json({ status: 'ok' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete application' });
  }
});

module.exports = router;
module.exports.getApplications = getApplications;
module.exports.getApplication = getApplication;
