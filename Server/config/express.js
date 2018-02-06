var express = require('express');
var morgan = require('morgan');
var logger = require('./logger');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var bluebird = require('bluebird');
var glob = require('glob');
var cors = require('cors');


module.exports = function (app, config) {

  //limit for upload sizes
  app.use(bodyParser.json({limit:'1000mb'}));
  app.use(bodyParser.json({limit:'1000mb', extended: true}));

  app.use(cors({origin: 'http://localhost:9000'}));

  //turn on the db, log inside console when ready
  logger.log("Loading Mongoose functionality");
  mongoose.Promise = require('bluebird');
  mongoose.connect(config.db, {useMongoClient:true});
  var db = mongoose.connection;
  db.on('error', function() {
    throw new Error('unable to connect to database at ' + config.db);
  });

  if(process.env.NODE_ENV != 'test') {
    app.use(morgan('dev'));
    mongoose.set('debug', true);
    mongoose.connection.once('open', function callback() {
      logger.log("mongoose connected to the database");
    });

    app.use(function(req,res,next) {
      logger.log('Request from ' + req.connection.remoteAddress, 'info');
      next();
    });
  }

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended:true
  }));

  //requires all models in /app/models/
  var models = glob.sync(config.root + '/app/models/*.js');
  models.forEach(function(model) {
    require(model);
  });

  //requires all controllers in /app/controllers/
  var controllers = glob.sync(config.root + '/app/controllers/*.js');
  controllers.forEach(function (controllers) {
   require(controllers)(app,config);
  });

  //serves public files (e.x. localhost:5000/index.html)
  app.use(express.static(config.root +'/public'));

  //404 handler
  app.use(function (req,res) {
    res.type('text/plain');
    res.status(404);
    res.send('404 Not Found');
  });

  //500 handler
  app.use(function (err, req, res, next) {
    console.log(err);
    if (process.env.NODE_ENV !== 'test') logger.log(err.stack,'error');
    res.type('text/plan');
    if(err.status){
      res.status(err.status).send(err.message);
    } else {
      res.status(500).send('500 Sever Error');
    }
  });

  console.log("Starting Application");
};
