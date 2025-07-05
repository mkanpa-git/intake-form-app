const clamav = require('clamav.js');
const { Readable } = require('stream');

const HOST = process.env.CLAMAV_HOST || '127.0.0.1';
const PORT = parseInt(process.env.CLAMAV_PORT, 10) || 3310;

function scanBuffer(buffer) {
  return new Promise((resolve, reject) => {
    console.log(`[ClamAV] Pinging ${HOST}:${PORT}...`);

    clamav.ping(PORT, HOST, 1000, pingErr => {
      if (pingErr) {
        console.error(`[ClamAV] Ping failed: ${pingErr.message}`);
        return reject(pingErr);
      }
      console.log('[ClamAV] Ping successful, scanning buffer...');
      const stream = Readable.from(buffer);
      clamav.createScanner(PORT, HOST).scan(stream, (err, _object, malicious) => {
        if (err) {
          console.error(`[ClamAV] Scan error: ${err.message}`);
          return reject(err);
        }
        if (malicious) {
          console.warn('[ClamAV] Malicious file detected!');
          const error = new Error('Malicious file detected');
          error.code = 'VIRUS_DETECTED';
          return reject(error);
        }
        console.log(`[ClamAV] File is clean.`);
        resolve();
      });
    });
  });
}

module.exports = { scanBuffer };
