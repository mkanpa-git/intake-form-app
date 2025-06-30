import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import TextInput from '../components/shared/TextInput/TextInput';
import Button from '../components/shared/Button';

export default function Profile() {
  const { user, setUser } = useContext(AuthContext);
  const [form, setForm] = useState({ first_name: '', middle_initial: '', last_name: '' });
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name || '',
        middle_initial: user.middle_initial || '',
        last_name: user.last_name || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/me', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      const data = await res.json();
      setUser(data);
      setStatus('Saved');
    } else {
      setStatus('Failed to save');
    }
  };

  if (!user) return <p>Please log in</p>;

  return (
    <form className="jules-profile-form" onSubmit={handleSubmit} aria-labelledby="profile-heading">
      <h1 id="profile-heading">Edit Profile</h1>
      <TextInput
        id="first_name"
        name="first_name"
        label="First Name"
        value={form.first_name}
        onChange={handleChange}
        required
      />
      <TextInput
        id="middle_initial"
        name="middle_initial"
        label="Middle Initial"
        value={form.middle_initial}
        onChange={handleChange}
      />
      <TextInput
        id="last_name"
        name="last_name"
        label="Last Name"
        value={form.last_name}
        onChange={handleChange}
        required
      />
      <Button type="submit" variant="primary">Save</Button>
      {status && <span role="status">{status}</span>}
    </form>
  );
}
