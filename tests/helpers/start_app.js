import Application from 'appkit/app';
import Router from 'appkit/router';

var container;

Application.initializer({
  name: 'extractContainer',

  initialize: function(c) {
    container = c;
  }
});

Ember.Test.registerHelper('lookup', function(app, fullName) {
  return container.lookup(fullName);
});

function startApp(attrs) {
  var App;

  var attributes = Ember.merge({
    // useful Test defaults
    rootElement: '#ember-testing',
    LOG_ACTIVE_GENERATION:false,
    LOG_VIEW_LOOKUPS: false
  }, attrs); // but you can override;

  Router.reopen({
    location: 'none'
  });

  Ember.run(function(){
    App = Application.create(attributes);

    App.setupForTesting();
    App.injectTestHelpers();
  });

  App.reset(); // this shouldn't be needed, i want to be able to "start an app at a specific URL"

  return App;
}

export default startApp;
