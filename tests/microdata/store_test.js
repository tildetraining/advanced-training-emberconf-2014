import Store from 'appkit/microdata/store';

var store;
var container;

var Person = Ember.Object.extend();

module("Unit - Store", {
  setup: function() {
    container = new Ember.Container();

    container.register('store:main', Store);
    container.register('model:person', Person);

    store = container.lookup('store:main');
  }
});

test("it exists", function(){
  ok(Store, "Store exists");
});

test("records can be pushed into the store", function() {
  store.push('person', {
    id: 'wycats',
    firstName: "Yehuda",
    lastName: "Katz"
  });

  var wycats = store.getById('person', 'wycats');
  ok(wycats, "The wycats record was found");

  equal(wycats.get('$data.firstName'), "Yehuda", "the firstName property is correct");
  equal(wycats.get('$data.lastName'), "Katz", "the lastName property is correct");
  equal(wycats.get('id'), "wycats", "the id property is correct");
});

test("push returns the created record", function() {
  var pushedWycats = store.push('person', {
    id: 'wycats',
    firstName: "Yehuda",
    lastName: "Katz"
  });

  var gottenWycats = store.getById('person', 'wycats');

  strictEqual(pushedWycats, gottenWycats, "both records are identical");
});

test("pushing a record into the store twice updates the original record", function() {
  store.push('person', {
    id: 'wycats',
    firstName: "Yehuda",
    lastName: "Katz"
  });

  var wycats = store.getById('person', 'wycats');
  ok(wycats, "The wycats record was found");

  equal(wycats.get('$data.firstName'), "Yehuda", "the firstName property is correct");
  equal(wycats.get('$data.lastName'), "Katz", "the lastName property is correct");
  equal(wycats.get('id'), "wycats", "the id property is correct");

  store.push('person', {
    id: 'wycats',
    firstName: "Yehudajamin",
    lastName: "Katzenfeld"
  });

  equal(wycats.get('$data.firstName'), "Yehudajamin", "the firstName property is correct");
  equal(wycats.get('$data.lastName'), "Katzenfeld", "the lastName property is correct");
  equal(wycats.get('id'), "wycats", "the id property is is correct");
});

test("finding a record by ID returns a promise for the requested record", function() {
  expect(3);
  stop();

  store.push('person', {
    id: 'wycats',
    firstName: "Yehuda",
    lastName: "Katz"
  });

  Ember.run(function() {
    store.find('person', 'wycats').then(function(wycats) {
      start();

      equal(wycats.get('$data.firstName'), "Yehuda", "the firstName property is correct");
      equal(wycats.get('$data.lastName'), "Katz", "the lastName property is correct");
      equal(wycats.get('id'), "wycats", "the id property is correct");
    });
  });
});

test("finding a record that doesn't exist returns a promise that rejects if there is no adapter", function() {
  expect(1);
  stop();

  Ember.run(function() {
    store.find('person', 'nonexistent-record').then(Ember.K, function() {
      start();

      ok(true, "promise was rejected");
    });
  });
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

