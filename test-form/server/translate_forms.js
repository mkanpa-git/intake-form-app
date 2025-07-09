const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const HttpsProxyAgent = require('https-proxy-agent');

const proxy = process.env.HTTPS_PROXY || process.env.https_proxy;
const agent = proxy ? new HttpsProxyAgent(proxy) : undefined;

const API_KEY = process.env.GOOGLE_API_KEY;
if (!API_KEY) {
  console.error('GOOGLE_API_KEY not set');
  process.exit(1);
}

const languages = ['ar','bn','zh','fr','ht','ko','pl','ru','es','ur'];
const dataDir = path.join(__dirname, '..', 'public', 'data');

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

async function translateFile(file) {
  const json = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
  for (const lang of languages) {
    const copy = JSON.parse(JSON.stringify(json));
    const keys = [];
    const vals = [];
    const walk = (obj) => {
      for (const k of Object.keys(obj)) {
        const v = obj[k];
        if (typeof v === 'string') {
          keys.push([obj, k]);
          vals.push(v);
        } else if (typeof v === 'object' && v) {
          walk(v);
        }
      }
    };
    walk(copy);
    const translated = [];
    for (let i = 0; i < vals.length; i += 50) {
      const slice = vals.slice(i, i + 50);
      const res = await translateBatch(slice, lang);
      translated.push(...res);
    }
    translated.forEach((t, i) => {
      const [o, k] = keys[i];
      o[k] = t;
    });
    const out = path.join(dataDir, file.replace('.json', `.${lang}.json`));
    fs.writeFileSync(out, JSON.stringify(copy, null, 2));
    console.log('Wrote', out);
  }
}

(async () => {
  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json') && !f.match(/\.[a-z]{2}\.json$/));
  for (const f of files) {
    await translateFile(f);
  }
})();
