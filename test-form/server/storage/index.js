const path = require('path');
const LocalStorageStrategy = require('./localStorage');
const GCPStorageStrategy = require('./gcpStorage');

function createStorageStrategy(options = {}) {
  const provider = (process.env.FILE_STORAGE || 'LOCAL').toUpperCase();
  if (provider === 'GCP') {
    const bucket = process.env.GCP_BUCKET;
    return new GCPStorageStrategy(bucket);
  }
  const baseDir = options.uploadsDir || path.join(__dirname, '..', 'uploads');
  return new LocalStorageStrategy(baseDir);
}

module.exports = createStorageStrategy;
