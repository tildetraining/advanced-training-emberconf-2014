/*
  In Step 2, you'll use what you've learned about initializers and injections
  to ensure that all of the controllers in the application have access to the
  store object.
*/

import Store from 'appkit/microdata/store';

var App;

step(2, "Initializers", {
  setup: function(){
    App = startApp();
  },

  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

// We may not want this test because it locks people in to having to
// name their initializer "microdata'
test("initializer defined", function() {
  ok(App.constructor.initializers.microdata, "microdata initializer exists");
});

test("controllers have access to the store", function() {
  ok(lookup('controller:article').get('store') instanceof Store);
});
