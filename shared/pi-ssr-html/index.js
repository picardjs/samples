//@pilet v:2(picard_pissrhtml,{})
System.register([], function (_export) {
  'use strict';

  function render(count) {
    var origin = typeof window === 'undefined' ? 'server' : 'client';
    return '<button type="button" class="pi-ssr-counter">Count: ' + count + '</button> <small>rendered on the ' + origin + '</small>';
  }

  // a framework-less component lifecycle that can be rendered on the server and hydrated on the client
  var counter = {
    stringify: function (props) {
      return render(props.start || 0);
    },
    mount: function (container, props, locals) {
      var count = props.start || 0;

      if (!locals.hydrate) {
        container.innerHTML = render(count);
      }

      var button = container.querySelector('.pi-ssr-counter');
      locals.increment = function () {
        button.textContent = 'Count: ' + ++count;
      };
      // new data (e.g., a changed data attribute) starts counting again
      locals.reset = function (start) {
        count = start;
        button.textContent = 'Count: ' + count;
      };
      button.addEventListener('click', locals.increment);
      container.dataset.mode = locals.hydrate ? 'hydrated' : 'rendered';
    },
    update: function (props, locals) {
      locals.reset?.(props.start || 0);
    },
    unmount: function (container, locals) {
      container.querySelector('.pi-ssr-counter')?.removeEventListener('click', locals.increment);
      delete container.dataset.mode;
    },
  };

  return {
    setters: [],
    execute: function () {
      _export('setup', function (api) {
        api.registerComponent('ssr-counter', counter);
      });
    },
  };
});
