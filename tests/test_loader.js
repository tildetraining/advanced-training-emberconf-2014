if (~location.search.indexOf('step=')) {
  var match = location.search.match(/step=(\d+)/);

  if (!match) {
    throw new Error("To run tests, provide the step number you would like to test after step=");
  }

  loadTests(match[1]);
}
else {
  loadAllTests();
}

// TODO: Figure out why grung test:server quits after
// executing tests when regex is /step\d+/ but not when
// it is /\_test/
function loadAllTests() {
  Ember.keys(requirejs._eak_seen).filter(function(key) {
    return (/step\d+/).test(key);
  }).forEach(function(moduleName) {
    require(moduleName, null, null, true);
  });
}

function loadTests(step) {
  for (var i=1; i<=step; i++) {
    if (i<10) i = "0" + i;
    var module = 'appkit/tests/microdata/step' + i;
    if (!requirejs._eak_seen[module]) {
      console.warn(module + " not found");
    }
    else {
      require(module, null, null, true);
    }
  }
}

