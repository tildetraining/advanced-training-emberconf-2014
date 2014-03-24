/*
  In Step 4, you'll be implementing the functionality to push new records into
  the store. Once you've pushed a record in, you should be able to
  synchronously retrieve it using a `getById` method that you will also
  implement.

  Remember that `getById` should return synchronously (not a promise); we'll be
  implementing the asynchronous `find` in a later step.

  Once a model has been retrieved, ensure that its properties are updated if
  new data is pushed into the store.

  When looking up & creating models, remember that you should always look them
  up using the container API instead of hard-coding globals. To verify that you
  have done this correctly, we have provided some commented-out tests at the
  end of the file that you can uncomment to verify the correct behavior, if
  time allows.
*/

import Store from 'appkit/microdata/store';
import Person from 'appkit/tests/helpers/person';

var store;

step(4, "Pushing to the Store", {
  setup: function() {
    var container = new Ember.Container();
    container.register('store:main', Store);
    container.register('model:person', Person);
    store = container.lookup('store:main');
  }
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

test("pushing doesn't mangle string ids", function() {
  store.push('person', {
    id: 'jamiebikies',
    firstName: 'Jamie',
    lastName: 'Gilgen'
  });

  var jamie = store.getById('person', 'jamiebikies');
  strictEqual(jamie.get('id'), 'jamiebikies');
});

/*
  If you finish the above steps ahead of time, you can uncomment
  the tests below to verify that you are correctly looking up model
  types using the container.
*/

// test("uses lookupFactory somewhere as part of a push", function() {
//   var orig = container.lookupFactory,
//       yipee;
//
//   container.lookupFactory = function() {
//     yipee = 'doodah';
//     return orig.apply(this, arguments);
//   };
//
//   store.push('person', {
//     id: 1,
//     firstName: 'Jamie',
//     lastName: 'Gilgen'
//   });
//
//   equal(yipee, 'doodah', "lookupFactory gets called");
// });


// test("uses container's returned typeFactory create() for instantiation", function() {
//   var orig = container.lookupFactory('model:person'),
//       origCreate = orig.create,
//       ping;
//
//   orig.create = function(opts) {
//     ping = 'pong';
//     return origCreate.apply(this, arguments);
//   };
//
//   store.push('person', {
//     id: 1,
//     firstName: 'Jamie',
//     lastName: 'Gilgen'
//   });
//
//   equal(ping, 'pong', "create on the lookupFactory gets called");
// });

