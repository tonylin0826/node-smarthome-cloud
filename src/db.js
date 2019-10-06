'use strict';

const CONFIG = require('./config');

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync(CONFIG.db);
const db = low(adapter);

db.defaults({ user: [
  {
    name: 'Tony Lin',
    email: 'tonylin0826@gmail.com',
    password: '1234567890'
  }
] }).write();

module.exports = {

};

