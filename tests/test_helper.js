// document.write('<div id="ember-testing-container"><div id="ember-testing"></div></div>');

Ember.testing = true;

window.step              = require('appkit/tests/helpers/step')['default'];
window.startApp          = require('appkit/tests/helpers/start_app')['default'];
window.isolatedContainer = require('appkit/tests/helpers/isolated_container')['default'];

function exists(selector) {
  return !!find(selector).length;
}

function getAssertionMessage(actual, expected, message) {
  return message || QUnit.jsDump.parse(expected) + " expected but was " + QUnit.jsDump.parse(actual);
}

function equal(actual, expected, message) {
  message = getAssertionMessage(actual, expected, message);
  QUnit.equal.call(this, actual, expected, message);
}

function strictEqual(actual, expected, message) {
  message = getAssertionMessage(actual, expected, message);
  QUnit.strictEqual.call(this, actual, expected, message);
}

function async(callback, timeout) {
  stop();

  var position = currentLine().trim();

  timeout = setTimeout(function() {
    ok(false, "Async defined " + position + " was never reached");

    // print to the console so you have a clickable link you can use to jump to
    // the source.
    console.error("Async defined " + position + " was never reached");

    start();
  }, timeout || 100);

  var cleared = false;

  return function() {
    if (!cleared) {
      cleared = true;
      window.clearTimeout(timeout);
      start();
    }

    var args = arguments, ret;

    Ember.run(function() {
      ret = callback.apply(this, args);
    });

    return ret;
  };
}

function currentLine() {
  try {
    throw new Error("EWOT");
  } catch(e) {
    return extractStacktrace(e, 3);
  }
}

// so far supports only Firefox, Chrome and Opera (buggy), Safari (for real exceptions)
// Later Safari and IE10 are supposed to support error.stack as well
// See also https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error/Stack
function extractStacktrace( e, offset ) {
  offset = offset === undefined ? 3 : offset;

  var stack, include, i;

  if ( e.stacktrace ) {
    // Opera
    return e.stacktrace.split( "\n" )[ offset + 3 ];
  } else if ( e.stack ) {
    // Firefox, Chrome
    stack = e.stack.split( "\n" );
    if (/^error$/i.test( stack[0] ) ) {
            stack.shift();
    }

    return stack[ offset ];
  } else if ( e.sourceURL ) {
    // Safari, PhantomJS
    // hopefully one day Safari provides actual stacktraces
    // exclude useless self-reference for generated Error objects
    if ( /qunit.js$/.test( e.sourceURL ) ) {
      return;
    }

    // for actual exceptions, this is useful
    return e.sourceURL + ":" + e.line;
  }
}


window.exists = exists;
window.equal = equal;
window.strictEqual = strictEqual;
window.async = async;
