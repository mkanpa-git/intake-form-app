import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import TextInput from '../components/shared/TextInput/TextInput';
import Button from '../components/shared/Button';
import { getCsrfToken } from '../utils/csrf';
import { useTranslation } from 'react-i18next';

export default function BusinessProfile() {
  const { user } = useContext(AuthContext);
  const { businessId } = useParams();
  const [form, setForm] = useState({
    legal_name: '',
    structure: '',
    ein: '',
    industry: '',
    sector: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    zip_code: '',
    primary_contact_name: '',
    primary_contact_phone: '',
    primary_contact_email: ''
  });
  const [status, setStatus] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    if (!businessId) return;
    fetch(`/api/profile/business/${businessId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setForm({
            legal_name: data.legal_name || '',
            structure: data.structure || '',
            ein: data.ein || '',
            industry: data.industry || '',
            sector: data.sector || '',
            address_line1: data.address_line1 || '',
            address_line2: data.address_line2 || '',
            city: data.city || '',
            state: data.state || '',
            zip_code: data.zip_code || '',
            primary_contact_name: data.primary_contact_name || '',
            primary_contact_phone: data.primary_contact_phone || '',
            primary_contact_email: data.primary_contact_email || ''
          });
        }
      });
  }, [businessId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/profile/business/${businessId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': getCsrfToken()
      },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      setStatus('Saved');
    } else {
      setStatus('Failed to save');
    }
  };

  if (!user) return <p>{t('pleaseLogIn')}</p>;

  return (
    <form className="jules-profile-form" onSubmit={handleSubmit} aria-labelledby="business-profile-heading">
      <h1 id="business-profile-heading">{t('editBusinessProfile')}</h1>
      <TextInput
        id="legal_name"
        name="legal_name"
        label={t('legalName')}
        value={form.legal_name}
        onChange={handleChange}
        required
      />
      <TextInput
        id="structure"
        name="structure"
        label={t('structure')}
        value={form.structure}
        onChange={handleChange}
      />
      <TextInput
        id="ein"
        name="ein"
        label={t('ein')}
        value={form.ein}
        onChange={handleChange}
      />
      <TextInput
        id="industry"
        name="industry"
        label={t('industry')}
        value={form.industry}
        onChange={handleChange}
      />
      <TextInput
        id="sector"
        name="sector"
        label={t('sector')}
        value={form.sector}
        onChange={handleChange}
      />
      <TextInput
        id="address_line1"
        name="address_line1"
        label={t('addressLine1')}
        value={form.address_line1}
        onChange={handleChange}
      />
      <TextInput
        id="address_line2"
        name="address_line2"
        label={t('addressLine2')}
        value={form.address_line2}
        onChange={handleChange}
      />
      <TextInput
        id="city"
        name="city"
        label={t('city')}
        value={form.city}
        onChange={handleChange}
      />
      <TextInput
        id="state"
        name="state"
        label={t('state')}
        value={form.state}
        onChange={handleChange}
      />
      <TextInput
        id="zip_code"
        name="zip_code"
        label={t('zipCode')}
        value={form.zip_code}
        onChange={handleChange}
      />
      <TextInput
        id="primary_contact_name"
        name="primary_contact_name"
        label={t('primaryContactName')}
        value={form.primary_contact_name}
        onChange={handleChange}
      />
      <TextInput
        id="primary_contact_phone"
        name="primary_contact_phone"
        label={t('primaryContactPhone')}
        value={form.primary_contact_phone}
        onChange={handleChange}
      />
      <TextInput
        id="primary_contact_email"
        name="primary_contact_email"
        label={t('primaryContactEmail')}
        value={form.primary_contact_email}
        onChange={handleChange}
      />
      <Button type="submit" variant="primary">{t('save')}</Button>
      {status && <span role="status">{status}</span>}
    </form>
  );
}

