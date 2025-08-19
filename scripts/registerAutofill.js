const fs = require('fs').promises;

async function main() {
  const filePath = process.argv[2] || 'config/autofill/sample_agency_form.json';
  const payload = await fs.readFile(filePath, 'utf8');
  const url = process.argv[3] || 'http://localhost:3000/api/common-intake/autofill/register';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload
    });

    const text = await response.text();
    if (!response.ok) {
      console.error(`Registration failed with status ${response.status}: ${text}`);
      process.exit(1);
    }

    console.log('Registration succeeded:', text);
  } catch (err) {
    console.error('Registration error:', err.message);
    process.exit(1);
  }
}

main();
