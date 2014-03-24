/*
  In the final step, you will want to support creating new records in addition
  to updating (and saving) existing records.

  You wouldn't want to handle both of these cases in the same place in the
  adapter: a newly created record may use an HTTP `POST`, while an update
  would use an HTTP `PUT`.

  Create a new adapter method to support saving newly created records, and
  wire it up to the rest of your code. You will want to track whether a
  record was newly created or originally loaded from the store so you can
  choose the correct adapter method when the record is saved.
*/

import Store from 'appkit/microdata/store';
import Model from 'appkit/microdata/model';
import Person from 'appkit/tests/helpers/person';

var store;

step(9, "Creating records", {
  setup: function() {
    var container = new Ember.Container();
    container.register('store:main', Store);
    container.register('model:person', Person);
    store = container.lookup('store:main');
  }
});

test("a newly created record can be saved", function() {
  store.adapter = {
    createRecord: async(function(type, record) {
      equal(type, 'person', "The type is correct");
      equal(record, person, "The record is correct");

      // equivalent of a 204
      return Ember.RSVP.resolve();
    }),

    updateRecord: async(function(type, record) {
      equal(type, 'person', "The type is correct");
      equal(record, person, "The record is correct");

      // equivalent of a 204
      return Ember.RSVP.resolve();
    })
  };

  var person = store.createRecord('person', { id: "<generated-uuid-1>", firstName: "Tom", lastName: "Dale" });

  Ember.run(function() {
    person.save().then(async(function(tom) {
      equal(tom.get('firstName'), "Tom");
      equal(tom.$data.firstName, "Tom");
      deepEqual(tom.$changes, {});

      tom.set('firstName', 'Thomas');

      return tom.save();
    })).then(async(function(tom) {
      equal(tom.get('firstName'), "Thomas");
      equal(tom.$data.firstName, "Thomas");
      deepEqual(tom.$changes, {});
    }));
  });

});

test("a newly created record can be saved and resolved with new information", function() {
  store.adapter = {
    createRecord: async(function(type, record) {
      equal(type, 'person', "The type is correct");
      equal(record, person, "The record is correct");

      // equivalent of a 204
      return Ember.RSVP.resolve({ id: 1, firstName: "Tom", lastName: "Dale" });
    }),

    updateRecord: async(function(type, record) {
      equal(type, 'person', "The type is correct");
      equal(record, person, "The record is correct");

      // equivalent of a 204
      return Ember.RSVP.resolve();
    })
  };

  var person = store.createRecord('person', { firstName: "Tom", lastName: "Dale" });

  Ember.run(function() {
    person.save().then(async(function(tom) {
      equal(tom.get('id'), 1);
      equal(tom.get('firstName'), "Tom");
      equal(tom.$data.firstName, "Tom");
      deepEqual(tom.$changes, {});

      tom.set('firstName', 'Thomas');

      return tom.save();
    })).then(async(function(tom) {
      equal(tom.get('firstName'), "Thomas");
      equal(tom.$data.firstName, "Thomas");
      deepEqual(tom.$changes, {});
    }));
  });
});
