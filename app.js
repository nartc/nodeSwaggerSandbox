
'use strict';

const SwaggerExpress = require('swagger-express-mw');
const app = require('express')();
const mongoose = require('mongoose');
const bluebird = require('bluebird');
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDoc = YAML.load('./api/swagger/swagger.yaml');
const logger = require('morgan');
const passport = require('passport');

const appConfig = require('./config/keys');

const showExplorer = true;

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc, showExplorer));

module.exports = app; // for testing

app.use(logger('dev'));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

var config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);
  var port = process.env.PORT || 10010;
  mongoose.Promise = bluebird;
  mongoose.connect('mongodb://localhost/cafelist');
  mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
  mongoose.connection.once('open', function(){
     
      app.listen(port);
  });
  if (swaggerExpress.runner.swagger.paths['/cafe']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/cafe');
  }
});