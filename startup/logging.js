const winston = require('winston');
// require('winston-mongodb');
require('express-async-errors');

const URI = 'mongodb://localhost/vividly';

module.exports = function () {
  winston.handleExceptions(
    new winston.transports.Console({ colorize: true, prettyPrint: true })
    // new winston.transports.MongoDB({ db: URI })
  );

  process.on('unhandledRejection', (err) => {
    throw err;
  });

  winston.add(winston.transports.File, { filename: 'logfile.log' });
  // winston.add(winston.transports.MongoDB, {
  //   db: URI,
  //   level: 'error',
  // });
};
