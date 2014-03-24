export default function(number, description, opts) {

  opts = !opts ? {} : opts;
  if (number < 10) number = "0" + number;

  module("Step " + number + ": " + description, {
    setup: function() {
      window.App = startApp();
      if (typeof(opts.setup) === 'function') opts.setup.apply(this);
      // location.hash = '';
      // App.reset();
    },

    teardown: function() {
      if (typeof(opts.teardown) === 'function') opts.teardown.apply(this);
      Ember.run(window.App, 'destroy');
      // Ember._viewsInTest.slice().forEach(function(view) {
      //   Ember.run(view, 'destroy');
      // });

      // Ember._viewsInTest = [];
    }
  });

}

