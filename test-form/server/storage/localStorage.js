const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { scanBuffer } = require('../virusScanner');

class LocalStorageStrategy {
  constructor(baseDir) {
    this.baseDir = baseDir;
    this.quarantineDir = path.join(path.dirname(baseDir), 'quarantine');
  }

  multerMiddleware() {
    return multer({ storage: multer.memoryStorage() }).array('files');
  }

  async saveFiles(appId, files) {
    const dir = path.join(this.baseDir, appId);
    fs.mkdirSync(dir, { recursive: true });
    const paths = [];
    for (const file of files) {
      try {
        await scanBuffer(file.buffer);
        const filename = `${Date.now()}-${file.originalname}`;
        fs.writeFileSync(path.join(dir, filename), file.buffer);
        paths.push(`/uploads/${appId}/${filename}`);
      } catch (err) {
        fs.mkdirSync(this.quarantineDir, { recursive: true });
        const qpath = path.join(this.quarantineDir, `${Date.now()}-${file.originalname}`);
        fs.writeFileSync(qpath, file.buffer);
        throw err;
      }
    }
    return paths;
  }
}

module.exports = LocalStorageStrategy;
