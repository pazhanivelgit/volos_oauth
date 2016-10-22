'use strict';

var volos = require('./../config/volos').default;
var proxy = require('./proxy');

exports.createApp = createApp;
exports.createToken = createToken;

// delete any existing app and create a new one
function createApp(cb) {

  var management = volos.management.create(volos.config);

  var devRequest = {
    firstName: 'Test',
    lastName: 'Developer',
    email: 'test@test.com',
    userName: 'testdev'
  };

  management.deleteDeveloper(devRequest.email, function() {

    console.log('Creating developer %s', devRequest.userName);
    management.createDeveloper(devRequest , function(err, developer) {
      if (err) { throw err; }

      var appRequest = { name: 'Test App', developerId: developer.id, scopes:['read','write']};
      console.log('Creating application %s for developer %s', appRequest.name, developer.id);

      management.createApp(appRequest, cb);
    });
  });
}

// delete any existing app and create a new one
function createApp(req,cb) {

  var management = volos.management.create(volos.config);

  var devRequest = {
    first_name: req.first_name,
    last_name: req.last_name,
    email: req.email,
    user_name: req.user_name
  };

  management.deleteDeveloper(devRequest.email, function() {

    console.log('Creating developer %s', devRequest.userName);
    management.createDeveloper(devRequest , function(err, developer) {
      if (err) { throw err; }
      //var appRequest = { name: 'Test App', developerId: developer.id, scopes:['read','write']};

      var _scope=req.scopes||null;

      var appRequest = { name: req.app_name, developerId: developer.id, scopes:_scope};
      console.log('Creating application %s for developer %s', appRequest.name, developer.id);
      management.createApp(appRequest, cb);
    });
  });
}



// generate a token
function createToken(app, oauth, cb) {

  var tokenRequest = {
    clientId: app.credentials[0].key,
    clientSecret: app.credentials[0].secret
  };

  oauth.spi.createTokenClientCredentials(tokenRequest, function(err, result) {
    if (err) { cb(err); }

    var accessToken = result.access_token;

    console.log('Client ID: %s', app.credentials[0].key);
    console.log('Client Secret: %s', app.credentials[0].secret);
    console.log('Access Token: %s', accessToken);

    tokenRequest.accessToken = accessToken;

    cb(null, tokenRequest);
  });
}
