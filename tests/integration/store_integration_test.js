import Store from 'appkit/microdata/store';
import Model from 'appkit/microdata/model';
import attr from 'appkit/microdata/attr';

var store;
var container;

var Person = Model.extend({
  firstName: attr(),
  lastName: attr()
});

module("Integration - Store/Model/Adapter", {
  setup: function() {
    container = new Ember.Container();

    container.register('store:main', Store);
    container.register('model:person', Person);

    store = container.lookup('store:main');
  }
});

// test("saving a record calls `save` on the adapter", function() {
//   store.adapter = {
//     updateRecord: async(function(type, record) {
//       equal(type, "person", "The type is passed in");
//       equal(record, person, "The record is passed in");
// 
//       // equivalent of a 204
//       return Ember.RSVP.resolve();
//     })
//   };
// 
//   var person = store.push('person', { id: 1, firstName: "Tom", lastName: "Dale" });
// 
//   Ember.run(function() {
//     person.save();
//   });
// });
// 
// test("an adapter that returns a promise that fulfills with no value merges changes", function() {
//   store.adapter = {
//     updateRecord: async(function(type, record) {
//       // equivalent of a 204
//       return Ember.RSVP.resolve();
//     })
//   };
// 
//   var person = store.push('person', { id: 1, firstName: "Tom", lastName: "Dale" });
//   person.set('firstName', "Thomas");
// 
//   Ember.run(function() {
//     person.save().then(async(function(tom) {
//       equal(tom.get('firstName'), "Thomas");
//       equal(tom.$data.firstName, "Thomas");
//       deepEqual(tom.$changes, {});
//     }));
//   });
// });
// 
// test("an adapter that reutrns a promise that fulfills with a payload replaces the original data", function() {
//   store.adapter = {
//     updateRecord: async(function(type, record) {
//       // equivalent of a 200
//       return Ember.RSVP.resolve({ id: 1, firstName: "Tomasz", lastName: "Dale" });
//     })
//   };
// 
//   var person = store.push('person', { id: 1, firstName: "Tom", lastName: "Dale" });
// 
//   Ember.run(function() {
//     person.save().then(async(function(tom) {
//       equal(tom.get('firstName'), "Tomasz");
//       equal(tom.$data.firstName, "Tomasz");
//       deepEqual(tom.$changes, {});
//     }));
//   });
// });
// 
// test("a newly created record can be saved", function() {
//   store.adapter = {
//     createRecord: async(function(type, record) {
//       equal(type, 'person', "The type is correct");
//       equal(record, person, "The record is correct");
// 
//       // equivalent of a 204
//       return Ember.RSVP.resolve();
//     }),
// 
//     updateRecord: async(function(type, record) {
//       equal(type, 'person', "The type is correct");
//       equal(record, person, "The record is correct");
// 
//       // equivalent of a 204
//       return Ember.RSVP.resolve();
//     })
//   };
// 
//   var person = store.createRecord('person', { id: "<generated-uuid-1>", firstName: "Tom", lastName: "Dale" });
// 
//   Ember.run(function() {
//     person.save().then(async(function(tom) {
//       equal(tom.get('firstName'), "Tom");
//       equal(tom.$data.firstName, "Tom");
//       deepEqual(tom.$changes, {});
// 
//       tom.set('firstName', 'Thomas');
// 
//       return tom.save();
//     })).then(async(function(tom) {
//       equal(tom.get('firstName'), "Thomas");
//       equal(tom.$data.firstName, "Thomas");
//       deepEqual(tom.$changes, {});
//     }));
//   });
// 
//   console.log(QUnit.config.semaphore);
// });
// 
// test("a newly created record can be saved and resolved with new information", function() {
//   store.adapter = {
//     createRecord: async(function(type, record) {
//       equal(type, 'person', "The type is correct");
//       equal(record, person, "The record is correct");
// 
//       // equivalent of a 204
//       return Ember.RSVP.resolve({ id: 1, firstName: "Tom", lastName: "Dale" });
//     }),
// 
//     updateRecord: async(function(type, record) {
//       equal(type, 'person', "The type is correct");
//       equal(record, person, "The record is correct");
// 
//       // equivalent of a 204
//       return Ember.RSVP.resolve();
//     })
//   };
// 
//   var person = store.createRecord('person', { firstName: "Tom", lastName: "Dale" });
// 
//   Ember.run(function() {
//     person.save().then(async(function(tom) {
//       equal(tom.get('id'), 1);
//       equal(tom.get('firstName'), "Tom");
//       equal(tom.$data.firstName, "Tom");
//       deepEqual(tom.$changes, {});
// 
//       tom.set('firstName', 'Thomas');
// 
//       return tom.save();
//     })).then(async(function(tom) {
//       equal(tom.get('firstName'), "Thomas");
//       equal(tom.$data.firstName, "Thomas");
//       deepEqual(tom.$changes, {});
//     }));
//   });
// });
