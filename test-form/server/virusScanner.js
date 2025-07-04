const clamav = require('clamav.js');
const { Readable } = require('stream');

const HOST = process.env.CLAMAV_HOST || '127.0.0.1';
const PORT = parseInt(process.env.CLAMAV_PORT, 10) || 3310;

function scanBuffer(buffer) {
  return new Promise((resolve, reject) => {
    clamav.ping(PORT, HOST, 1000, pingErr => {
      if (pingErr) return reject(pingErr);
      const stream = Readable.from(buffer);
      clamav.createScanner(PORT, HOST).scan(stream, (err, _object, malicious) => {
        if (err) return reject(err);
        if (malicious) {
          const error = new Error('Malicious file detected');
          error.code = 'VIRUS_DETECTED';
          return reject(error);
        }
        resolve();
      });
    });
  });
}

module.exports = { scanBuffer };
