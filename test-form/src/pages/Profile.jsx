import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

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
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          First Name
          <input name="first_name" value={form.first_name} onChange={handleChange} />
        </label>
      </div>
      <div>
        <label>
          Middle Initial
          <input name="middle_initial" value={form.middle_initial} onChange={handleChange} />
        </label>
      </div>
      <div>
        <label>
          Last Name
          <input name="last_name" value={form.last_name} onChange={handleChange} />
        </label>
      </div>
      <button type="submit">Save</button>
      {status && <span>{status}</span>}
    </form>
  );
}
