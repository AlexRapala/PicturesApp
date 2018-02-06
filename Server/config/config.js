var path = require('path'),
  rootPath = path.normalize(__dirname + '/..'),
  env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: { name: 'PicturesApp'},
    port: 5000,
    db: 'mongodb://127.0.0.1/PicturesApp-dev',
    uploads: rootPath + '/public/uploads/',
    secret: 'myleg'
  },
  production: {
    root: rootPath,
    app:{ name: 'PicturesApp' },
    port: 80,
    db: 'mongodb://127.0.0.1/PicturesApp',
    uploads: rootPath + "/public/uploads/"
  }
};

module.exports = config[env];
