/*
  In Step 5, you'll start to lay the groundwork for being able to make changes
  to records after you've retrieved them from the store.

  The first step is to make sure that the computed properties your `attr`
  factory support being `set` as well as `get`.

  After that, you'll need to implement a "protected" method on the model called
  `$mergeChanges`. This method should collapse any pending changes in the
  `$changes` hash into `$data`. While it will only be exercised in these tests
  for now, in a future step the store will use this method when interacting
  with the adapter.
*/

import Store from 'appkit/microdata/store';
import Person from 'appkit/tests/helpers/person';

var store;
var container;

step(5, "Updating the Store", {
  setup: function() {
    container = new Ember.Container();
    container.register('store:main', Store);
    container.register('model:person', Person);
    store = container.lookup('store:main');
  }
});

test("You can change attributes", function() {
  var person = Person.create({ $data: { firstName: "Tom", lastName: "Dale" } });

  person.set('firstName', "Thomas");

  equal(person.get('firstName'), "Thomas");
  equal(person.get('lastName'), "Dale");
});

test("a record can merge changes into $data", function() {
  var person = Person.create({
    $data: { firstName: "Yehuda", lastName: "Katz" },
  });

  person.set('lastName', 'Schwarzkopf');

  person.$mergeChanges();

  deepEqual(person.$data, {
    firstName: "Yehuda",
    lastName: "Schwarzkopf"
  }, "changes were merged into $data");
});

