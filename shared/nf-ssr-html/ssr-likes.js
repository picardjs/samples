import { render } from './render.js';

// a framework-less component lifecycle that can be rendered on the server and hydrated on the client
export default {
  stringify(props) {
    return render(props.likes || 0);
  },
  mount(container, props, locals) {
    let likes = props.likes || 0;

    if (!locals.hydrate) {
      container.innerHTML = render(likes);
    }

    const button = container.querySelector('.nf-ssr-likes');
    locals.like = () => {
      button.textContent = `${++likes} likes`;
    };
    // new data (e.g., a changed data attribute) starts counting again
    locals.reset = (value) => {
      likes = value;
      button.textContent = `${likes} likes`;
    };
    button.addEventListener('click', locals.like);
    container.dataset.mode = locals.hydrate ? 'hydrated' : 'rendered';
  },
  update(props, locals) {
    locals.reset?.(props.likes || 0);
  },
  unmount(container, locals) {
    container.querySelector('.nf-ssr-likes')?.removeEventListener('click', locals.like);
    delete container.dataset.mode;
  },
};
