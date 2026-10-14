import type { Handle } from '@sveltejs/kit/hooks';
import { picard } from '#lib/server/picard.ts';

export const handle: Handle = async ({ event, resolve }) => {
	let html = '';

	return resolve(event, {
		// renders the micro frontends into the pi-* elements of the page
		async transformPageChunk(chunk) {
			// streamed pages come in multiple chunks - the micro frontends are rendered into the whole page
			html += chunk.html;
			return chunk.done ? picard.decorate(html) : '';
		}
	});
};
