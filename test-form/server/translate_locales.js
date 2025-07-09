const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const HttpsProxyAgent = require('https-proxy-agent');

const API_KEY = process.env.GOOGLE_API_KEY;
if (!API_KEY) {
  console.error('GOOGLE_API_KEY not set');
  process.exit(1);
}

const proxy = process.env.HTTPS_PROXY || process.env.https_proxy;
const agent = proxy ? new HttpsProxyAgent(proxy) : undefined;

const languages = ['ar','bn','zh','fr','ht','ko','pl','ru','es','ur'];
const localesDir = path.join(__dirname, '..', 'public', 'locales');

async function translateBatch(texts, target) {
  const url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ q: texts, target, format: 'text' }),
    agent,
  });
  if (!res.ok) throw new Error(`Translate failed: ${res.status}`);
  const json = await res.json();
  return json.data.translations.map(t => t.translatedText);
}

(async () => {
  const base = JSON.parse(fs.readFileSync(path.join(localesDir, 'en', 'translation.json'), 'utf8'));
  const keys = Object.keys(base);
  const values = Object.values(base);
  for (const lang of languages) {
    const translations = [];
    for (let i = 0; i < values.length; i += 50) {
      const slice = values.slice(i, i + 50);
      const result = await translateBatch(slice, lang);
      translations.push(...result);
    }
    const out = {};
    keys.forEach((k, i) => { out[k] = translations[i]; });
    const langDir = path.join(localesDir, lang);
    fs.mkdirSync(langDir, { recursive: true });
    fs.writeFileSync(path.join(langDir, 'translation.json'), JSON.stringify(out, null, 2));
    console.log('Wrote', lang, 'translation');
  }
})();
