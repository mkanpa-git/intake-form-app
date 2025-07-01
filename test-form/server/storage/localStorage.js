const multer = require('multer');
const fs = require('fs');
const path = require('path');

class LocalStorageStrategy {
  constructor(baseDir) {
    this.baseDir = baseDir;
  }

  multerMiddleware() {
    return multer({
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          const dir = path.join(this.baseDir, req.params.appId);
          fs.mkdirSync(dir, { recursive: true });
          cb(null, dir);
        },
        filename: (req, file, cb) => {
          cb(null, Date.now() + '-' + file.originalname);
        }
      })
    }).array('files');
  }

  async saveFiles(appId, files) {
    return files.map(f => `/uploads/${appId}/${f.filename}`);
  }
}

module.exports = LocalStorageStrategy;
