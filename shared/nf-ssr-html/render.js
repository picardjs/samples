// a relative import to show that the ES modules are linked on the server, too
export function render(likes) {
  const origin = typeof window === 'undefined' ? 'server' : 'client';
  // import.meta.url is the URL of this module - on the server and on the client
  const file = new URL(import.meta.url).pathname.split('/').pop();
  return `<button type="button" class="nf-ssr-likes">${likes} likes</button> <small>rendered on the ${origin} by ${file}</small>`;
}
