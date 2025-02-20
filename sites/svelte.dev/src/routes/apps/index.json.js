import * as gist from '$lib/db/gist';

export async function get({ query, locals }) {
	if (locals.user) {
		const offset = query.get('offset') ? parseInt(query.get('offset')) : 0;
		const search = query.get('search');

		return {
			body: await gist.list(locals.user, { offset, search })
		};
	} else {
		return { status: 401 };
	}
}
