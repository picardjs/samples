//@pilet v:2(picard_appinfo,{})
System.register([], function (_export, _context) {
  'use strict';

  // a micro frontend bundled with the app - shows where it has been loaded from
  var info = {
    mount: function (container) {
      var platform = window.Capacitor ? window.Capacitor.getPlatform() : 'unknown';
      container.innerHTML =
        '<dl class="app-info">' +
        '<dt>Platform</dt><dd>' + platform + '</dd>' +
        '<dt>Origin</dt><dd>' + location.origin + '</dd>' +
        '<dt>Loaded from</dt><dd>' + _context.meta.url + '</dd>' +
        '</dl>';
    },
    unmount: function (container) {
      container.innerHTML = '';
    },
  };

  return {
    setters: [],
    execute: function () {
      _export('setup', function (api) {
        api.registerComponent('info', info);
      });
    },
  };
});
