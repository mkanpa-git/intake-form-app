const multer = require('multer');
const { Storage } = require('@google-cloud/storage');

class GCPStorageStrategy {
  constructor(bucketName) {
    if (!bucketName) throw new Error('GCP bucket name is required');
    this.bucket = new Storage().bucket(bucketName);
  }

  multerMiddleware() {
    return multer({ storage: multer.memoryStorage() }).array('files');
  }

  async saveFiles(appId, files) {
    const uploads = files.map(file => {
      const destination = `${appId}/${Date.now()}-${file.originalname}`;
      return this.bucket.file(destination)
        .save(file.buffer)
        .then(() => `https://storage.googleapis.com/${this.bucket.name}/${destination}`);
    });
    return Promise.all(uploads);
  }
}

module.exports = GCPStorageStrategy;
