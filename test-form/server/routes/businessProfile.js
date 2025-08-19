const express = require('express');
const pool = require('../db');

const router = express.Router();

router.get('/api/profile/business/:businessId', async (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  try {
    const result = await pool.query(
      'SELECT * FROM businesses WHERE id=$1 AND user_id=$2',
      [req.params.businessId, req.user.id]
    );
    const business = result.rows[0];
    if (!business) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.json(business);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load business profile' });
  }
});

router.put('/api/profile/business/:businessId', async (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const {
    legal_name = null,
    structure = null,
    ein = null,
    industry = null,
    sector = null,
    address_line1 = null,
    address_line2 = null,
    city = null,
    state = null,
    zip_code = null,
    primary_contact_name = null,
    primary_contact_email = null,
    primary_contact_phone = null,
  } = req.body || {};
  try {
    const result = await pool.query(
      `INSERT INTO businesses (
         id, user_id, legal_name, structure, ein, industry, sector,
         address_line1, address_line2, city, state, zip_code,
         primary_contact_name, primary_contact_email, primary_contact_phone)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
       ON CONFLICT (id) DO UPDATE SET
         legal_name = EXCLUDED.legal_name,
         structure = EXCLUDED.structure,
         ein = EXCLUDED.ein,
         industry = EXCLUDED.industry,
         sector = EXCLUDED.sector,
         address_line1 = EXCLUDED.address_line1,
         address_line2 = EXCLUDED.address_line2,
         city = EXCLUDED.city,
         state = EXCLUDED.state,
         zip_code = EXCLUDED.zip_code,
         primary_contact_name = EXCLUDED.primary_contact_name,
         primary_contact_email = EXCLUDED.primary_contact_email,
         primary_contact_phone = EXCLUDED.primary_contact_phone,
         updated_at = NOW()
       WHERE businesses.user_id = EXCLUDED.user_id
       RETURNING *`,
      [
        req.params.businessId,
        req.user.id,
        legal_name,
        structure,
        ein,
        industry,
        sector,
        address_line1,
        address_line2,
        city,
        state,
        zip_code,
        primary_contact_name,
        primary_contact_email,
        primary_contact_phone,
      ]
    );
    if (result.rowCount === 0) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save business profile' });
  }
});

module.exports = router;
