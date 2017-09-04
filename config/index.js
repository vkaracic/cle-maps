const env = process.env.NODE_ENV || 'development';
let config;

if (env === 'test') {
  config = require('./test.json')['test'];
} else {
  config = require('./config.json')[env];
}

module.exports = config;
