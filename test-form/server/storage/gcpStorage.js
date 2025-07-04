const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const fs = require('fs');
const path = require('path');
const { scanBuffer } = require('../virusScanner');

class GCPStorageStrategy {
  constructor(bucketName) {
    if (!bucketName) throw new Error('GCP bucket name is required');
    this.bucket = new Storage().bucket(bucketName);
    this.quarantineDir = path.join(__dirname, '..', 'quarantine');
  }

  multerMiddleware() {
    return multer({ storage: multer.memoryStorage() }).array('files');
  }

  async saveFiles(appId, files) {
    const uploads = files.map(async file => {
      try {
        await scanBuffer(file.buffer);
        const destination = `${appId}/${Date.now()}-${file.originalname}`;
        await this.bucket.file(destination).save(file.buffer);
        return `https://storage.googleapis.com/${this.bucket.name}/${destination}`;
      } catch (err) {
        fs.mkdirSync(this.quarantineDir, { recursive: true });
        const qpath = path.join(this.quarantineDir, `${Date.now()}-${file.originalname}`);
        fs.writeFileSync(qpath, file.buffer);
        throw err;
      }
    });
    return Promise.all(uploads);
  }
}

module.exports = GCPStorageStrategy;
