/*
  In Step 1, you'll define the classes that make up the core store, adapter and
  model architecture.

  This is a good opportunity for you to familiarize yourself with the new ES6
  module syntax if you haven't used it before.

  To get the tests passing, all you need to do is create new files in the
  appropriate locations and ensure they're exporting classes (or, in the
  case of the `attr` module, a function).

  Once you've got the modules created, we'll be filling them in the later
  steps.
*/

import Adapter from 'appkit/microdata/adapter';
import Store from 'appkit/microdata/store';
import Model from 'appkit/microdata/model';
import attr from 'appkit/microdata/attr';

step(1, "Basic Definitions");

test("Adapter", function() {
  ok(Adapter, "exists");
});

test("Model", function() {
  ok(Model, "exists");
});

test("attr exists", function() {
  ok(attr, "attr exists");
  ok(Ember.typeOf(attr) === 'function', "attr is a macro");
});

test("store exists", function() {
  ok(Store, "Store exists");
});

