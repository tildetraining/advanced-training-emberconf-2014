/*
  In Step 8, we'll get down to the nuts and bolts of how client-side
  persistence works by implementing the store/adapter pattern.

  You want to decouple how your application works from how your particular
  server happens to represent data. The store helps the application fetch
  records, and delegates to the adapter when backend-specific questions
  arise.

  In this step, you'll want to implement an adapter and have your existing
  store implementation delegate to it when records are looked up via
  `find()` or saved via `save()` on the model.

  When saving a record, you should always treat the new data coming in from
  the adapter as canonical. (That is, it should replace the old `$data` hash,
  if it exists.)

  If the adapter is unable to save changes (that is, the promise returned
  from the adapter is rejected), you should not modify the canonical `$data`
  until another attempt to save is made.
*/

import Store from 'appkit/microdata/store';
import Model from 'appkit/microdata/model';
import Person from 'appkit/tests/helpers/person';

var store;

step(7, "Adapter API", {
  setup: function() {
    var container = new Ember.Container();
    container.register('store:main', Store);
    container.register('model:person', Person);
    store = container.lookup('store:main');
  }
});

test("finding a record that doesn't exist queries the adapter", function() {
  store.adapter = {
    find: async(function(type, id) {
      equal(type, 'person', "find is passed person type");
      equal(id, 'wycats', "find is passed wycats id");

      return Ember.RSVP.resolve({
        id: 'wycats',
        firstName: "Yehuda",
        lastName: "Katz"
      });
    })
  };

  Ember.run(function() {
    store.find('person', 'wycats').then(async(function(wycats) {
      equal(wycats.get('$data.firstName'), "Yehuda", "the firstName property is correct");
      equal(wycats.get('$data.lastName'), "Katz", "the lastName property is correct");
      equal(wycats.get('id'), "wycats", "the id property is correct");
    }));
  });
});

test("saving a record calls `save` on the adapter", function() {
  store.adapter = {
    updateRecord: async(function(type, record) {
      equal(type, "person", "The type is passed in");
      equal(record, person, "The record is passed in");

      // equivalent of a 204
      return Ember.RSVP.resolve();
    })
  };

  var person = store.push('person', { id: 1, firstName: "Tom", lastName: "Dale" });

  Ember.run(function() {
    person.save();
  });
});

test("an adapter that returns a promise that fulfills with no value merges changes", function() {
  store.adapter = {
    updateRecord: async(function(type, record) {
      // equivalent of a 204
      return Ember.RSVP.resolve();
    })
  };

  var person = store.push('person', { id: 1, firstName: "Tom", lastName: "Dale" });
  person.set('firstName', "Thomas");

  Ember.run(function() {
    person.save().then(async(function(tom) {
      equal(tom.get('firstName'), "Thomas");
      equal(tom.$data.firstName, "Thomas");
      deepEqual(tom.$changes, {});
    }));
  });
});

test("an adapter that reutrns a promise that fulfills with a payload replaces the original data", function() {
  store.adapter = {
    updateRecord: async(function(type, record) {
      // equivalent of a 200
      return Ember.RSVP.resolve({ id: 1, firstName: "Tomasz", lastName: "Dale" });
    })
  };

  var person = store.push('person', { id: 1, firstName: "Tom", lastName: "Dale" });

  Ember.run(function() {
    person.save().then(async(function(tom) {
      equal(tom.get('firstName'), "Tomasz");
      equal(tom.$data.firstName, "Tomasz");
      deepEqual(tom.$changes, {});
    }));
  });
});

test("an adapter that returns a promise that rejects does not merge changes", function() {
  store.adapter = {
    updateRecord: async(function(type, record) {
      return Ember.RSVP.reject(record);
    })
  };

  var person = store.push('person', { id: 2, firstName: "Jamie", lastName: "Gilgen" });
  person.set('firstName', "Jamiebikies");

  Ember.run(function() {
    person.save().then(function() {
      ok(false, "This should not be reached");
    }, async(function(tom) {
      equal(tom.get('firstName'), "Jamiebikies");
      equal(tom.$data.firstName, "Jamie");
      deepEqual(tom.$changes, { firstName: 'Jamiebikies' });
    }));
  });
});
