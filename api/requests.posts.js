import camelcase from 'camelcase-keys';
import url from './utils';

/**
 * Get a list of posts for a given user.
 * @param {Object} request Request data.
 * @param {number} request.userId ID of user to get posts of.
 * @param {string} request.sessionToken Authorisation token from logged in user.
 * @returns A parsed response object.
 */
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

/**
 * Create a new post on the given user's profile.
 * @param {Object} request Request data.
 * @param {number} request.userId ID of the user to create a post on their page.
 * @param {string} request.sessionToken Authorisation token from logged in user.
 * @param {string} request.text Text contents of the post.
 * @returns A parsed response object.
 */
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

/**
 * Get a post on a given user's profile.
 * @param {Object} request Request data.
 * @param {number} request.userId ID of the user to create a post on their page.
 * @param {number} request.postId ID of the post to get.
 * @param {string} request.sessionToken Authorisation token from logged in user.
 * @returns A parsed response object.
 */
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

/**
 * Update a post on a given user's profile.
 * @param {Object} request Request data.
 * @param {number} request.userId ID of the user who's profile the post to be updated is located.
 * @param {number} request.postId ID of the post to update.
 * @param {string} request.sessionToken Authorisation token from logged in user.
 * @returns A parsed response object.
 */
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

/**
 * Delete a post on a given user's profile.
 * @param {Object} request Request data.
 * @param {number} request.userId ID of the user who's profle the post to be deleted is located.
 * @param {number} request.postId ID of the post to delete.
 * @param {string} request.sessionToken Authorisation token from logged in user.
 * @returns A parsed response object.
 */
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

/**
 * Likes a post on a user's profile.
 * @param {Object} request Request data.
 * @param {number} request.userId ID of the user's profile.
 * @param {number} request.postId ID of post to like.
 * @param {string} request.sessionToken Authorisation token from logged in user.
 * @returns A parsed response object.
 */
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

/**
 * Unlikes a post on a user's profile.
 * @param {Object} request Request data.
 * @param {number} request.userId ID of the user's profile.
 * @param {number} request.postId ID of post to unlike.
 * @param {string} request.sessionToken Authorisation token from logged in user.
 * @returns A parsed response object.
 */
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
