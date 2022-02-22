import camelcase from 'camelcase-keys';
import url from './utils';

export async function getPosts({ userId, sessionToken }) {
	const response = await fetch(url(`user/${userId}/post`), {
		headers: {
			'X-Authorization': sessionToken,
		},
	});

	let returnValue = null;

	switch (response.status) {
		case 200:
			returnValue = {
				ok: true,
				message: 'got posts.',
				body: camelcase(await response.json(), { deep: true }),
			};
			break;
		case 401:
			returnValue = {
				ok: false,
				message: 'not authorised to perform this action.',
			};
			break;
		case 403:
			returnValue = {
				ok: false,
				message: 'can only view the posts of yourself or your friends.',
			};
			break;
		case 404:
			returnValue = { ok: false, message: 'no posts found.' };
			break;
		case 500:
			returnValue = { ok: false, message: 'unable to reach server.' };
			break;
		default:
			returnValue = { ok: false, message: 'something went wrong.' };
			break;
	}

	return returnValue;
}

export async function createPost({ userId, sessionToken, text }) {
	const response = await fetch(url(`user/${userId}/post`), {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-Authorization': sessionToken,
		},
		body: JSON.stringify({ text }),
	});

	let returnValue = null;

	switch (response.status) {
		case 201:
			returnValue = {
				ok: true,
				message: 'created a post.',
				body: camelcase(await response.json()),
			};
			break;
		case 401:
			returnValue = {
				ok: false,
				message: 'not authorised to perform this action.',
			};
			break;
		case 404:
			returnValue = { ok: false, message: 'no user data found.' };
			break;
		case 500:
			returnValue = { ok: false, message: 'unable to reach server.' };
			break;
		default:
			returnValue = { ok: false, message: 'something went wrong.' };
			break;
	}

	return returnValue;
}

export async function getPost({ userId, postId, sessionToken }) {
	const response = await fetch(url(`user/${userId}/post/${postId}`), {
		headers: {
			'X-Authorization': sessionToken,
		},
	});

	let returnValue = null;

	switch (response.status) {
		case 200:
			returnValue = {
				ok: true,
				message: 'got post.',
				body: camelcase(await response.json(), { deep: true }),
			};
			break;
		case 401:
			returnValue = {
				ok: false,
				message: 'not authorised to perform this action.',
			};
			break;
		case 403:
			returnValue = {
				ok: false,
				message: 'can only view the posts of yourself or your friends.',
			};
			break;
		case 404:
			returnValue = { ok: false, message: 'no post found.' };
			break;
		case 500:
			returnValue = { ok: false, message: 'unable to reach server.' };
			break;
		default:
			returnValue = { ok: false, message: 'something went wrong.' };
			break;
	}

	return returnValue;
}

export async function updatePost({ userId, postId, sessionToken, post }) {
	const response = await fetch(url(`user/${userId}/post/${postId}`), {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
			'X-Authorization': sessionToken,
		},
		body: JSON.stringify(post),
	});

	let returnValue = null;

	switch (response.status) {
		case 200:
			returnValue = { ok: true, message: 'updated post.' };
			break;
		case 400:
			returnValue = { ok: false, message: 'invalid data to update post.' };
			break;
		case 401:
			returnValue = {
				ok: false,
				message: 'not authorised to perform this action.',
			};
			break;
		case 403:
			returnValue = {
				ok: false,
				message: 'you can only update your own posts.',
			};
			break;
		case 404:
			returnValue = { ok: false, message: 'no post found.' };
			break;
		case 500:
			returnValue = { ok: false, message: 'unable to reach server.' };
			break;
		default:
			returnValue = { ok: false, message: 'something went wrong.' };
			break;
	}

	return returnValue;
}

export async function deletePost({ userId, postId, sessionToken }) {
	const response = await fetch(url(`user/${userId}/post/${postId}`), {
		method: 'DELETE',
		headers: {
			'X-Authorization': sessionToken,
		},
	});

	let returnValue = null;

	switch (response.status) {
		case 200:
			returnValue = { ok: true, message: 'delete post.' };
			break;
		case 401:
			returnValue = {
				ok: false,
				message: 'not authorised to perform this action.',
			};
			break;
		case 403:
			returnValue = {
				ok: false,
				message: 'you can only delete your own posts.',
			};
			break;
		case 404:
			returnValue = { ok: false, message: 'no post found.' };
			break;
		case 500:
			returnValue = { ok: false, message: 'unable to reach server.' };
			break;
		default:
			returnValue = { ok: false, message: 'something went wrong.' };
			break;
	}

	return returnValue;
}

export async function likePost({ userId, postId, sessionToken }) {
	const response = await fetch(url(`user/${userId}/post/${postId}/like`), {
		method: 'POST',
		headers: {
			'X-Authorization': sessionToken,
		},
	});

	let returnValue = null;

	switch (response.status) {
		case 200:
			returnValue = { ok: true, message: 'liked post.' };
			break;
		case 400:
			returnValue = {
				ok: false,
				message: 'this post has already been liked.',
				body: { isAlreadyLiked: true },
			};
			break;
		case 401:
			returnValue = {
				ok: false,
				message: 'not authorised to perform this action.',
			};
			break;
		case 403:
			returnValue = { ok: false, message: 'can only like friends posts.' };
			break;
		case 404:
			returnValue = { ok: false, message: 'no post found.' };
			break;
		case 500:
			returnValue = { ok: false, message: 'unable to reach server.' };
			break;
		default:
			returnValue = { ok: false, message: 'something went wrong.' };
			break;
	}

	return returnValue;
}

export async function unlikePost({ userId, postId, sessionToken }) {
	const response = await fetch(url(`user/${userId}/post/${postId}/like`), {
		method: 'DELETE',
		headers: {
			'X-Authorization': sessionToken,
		},
	});

	let returnValue = null;

	switch (response.status) {
		case 200:
			returnValue = { ok: true, message: 'unliked post.' };
			break;
		case 400:
			returnValue = {
				ok: false,
				message: 'this post has already been unliked.',
				body: { isAlreadyUnliked: true },
			};
			break;
		case 401:
			returnValue = {
				ok: false,
				message: 'not authorised to perform this action.',
			};
			break;
		case 403:
			returnValue = { ok: false, message: 'can only like friends posts.' };
			break;
		case 404:
			returnValue = { ok: false, message: 'no post found.' };
			break;
		case 500:
			returnValue = { ok: false, message: 'unable to reach server.' };
			break;
		default:
			returnValue = { ok: false, message: 'something went wrong.' };
			break;
	}

	return returnValue;
}
