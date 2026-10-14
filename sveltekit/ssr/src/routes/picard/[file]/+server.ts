import { error } from '@sveltejs/kit';
import { getIslandsFile } from 'picard-js/node';
import type { RequestHandler } from './$types';

// the files of the islands script resuming the micro frontends in the browser
export const GET: RequestHandler = ({ params }) => {
	const content = getIslandsFile(params.file);

	if (content === undefined) {
		error(404, 'Not found');
	}

	return new Response(content, { headers: { 'content-type': 'text/javascript' } });
};
