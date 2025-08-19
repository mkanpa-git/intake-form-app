const path = require('path');
const translations = require(path.join(__dirname, '../../public/locales/en/translation.json'));

module.exports = {
  t: (key, opts = {}) => {
    let str = translations[key] || key;
    Object.keys(opts).forEach((k) => {
      str = str.replace(`{{${k}}}`, opts[k]);
    });
    return str;
  },
  changeLanguage: () => Promise.resolve(),
};

