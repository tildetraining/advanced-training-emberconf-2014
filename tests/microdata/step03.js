/*
  In Step 3, we'll test the "protected" interface between the store and the
  model class.

  To do that, the tests set a newly-instantiated model's `$data` property and
  ensure that those properties can be retrieved as normal properties from the
  model instance.
*/

import Person from 'appkit/tests/helpers/person';

step(3, "Model definition");

test("You can add attributes to the model via $data", function() {
  var person = Person.create({ $data: { firstName: "Tom", lastName: "Dale" } });

  equal(person.get('firstName'), "Tom");
  equal(person.get('lastName'), "Dale");
});

