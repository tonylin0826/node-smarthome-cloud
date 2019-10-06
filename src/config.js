'use strict';

const CONFIG = {
  db: '/tmp/smart-home-db.json'
};

if (process.env.NODE_ENV === 'production') {
  CONFIG.db = '/etc/smarthome/smart-home-db.json';
} else if (process.env.NODE_ENV === 'development') {
  CONFIG.db = '/tmp/smart-home-db.json';
}

module.exports = CONFIG;