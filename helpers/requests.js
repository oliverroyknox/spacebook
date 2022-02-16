import camelcase from 'camelcase-keys';
import { baseUrl } from '../config/server.config.json';

/**
 * Constructs a safe URL to the server.
 * @param {string} path Path in URL to add.
 * @returns A safe URL.
 */
function url(path) {
  return new URL(path, baseUrl);
}

/**
 * Log a user account in.
 * @param {Object} request Request data.
 * @param {string} request.email Email of user account.
 * @param {string} request.password Password for user account.
 * @returns A parsed response object.
 */
export async function login({ email, password }) {
  const response = await fetch(url('login'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  let returnValue = null;

  switch (response.status) {
    case 200:
      returnValue = {
        ok: true,
        message: 'successful login.',
        body: camelcase(await response.json()),
      };
      break;
    case 400:
      returnValue = { ok: false, message: 'invalid email or password.' };
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
 * Signs up a new user account.
 * @param {Object} request Request data.
 * @param {string} request.email Email of user account.
 * @param {string} request.password Password of user account.
 * @param {string} request.firstName First name of user.
 * @param {string} request.lastName Last name of user.
 * @returns A parsed response object.
 */
export async function signup({
  email, password, firstName, lastName,
}) {
  const response = await fetch(url('user'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
      first_name: firstName,
      last_name: lastName,
    }),
  });

  let returnValue = null;

  switch (response.status) {
    case 201:
      returnValue = {
        ok: true,
        message: 'successful signup.',
        body: camelcase(await response.json()),
      };
      break;
    case 400:
      returnValue = { ok: false, message: 'invalid registration details.' };
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
 * Logs out the current user.
 * @param {Object} request Request data.
 * @param {string} request.sessionToken Authorisation token from logged in user.
 * @returns A parsed response object.
 */
export async function logout({ sessionToken }) {
  const response = await fetch(url('logout'), {
    method: 'POST',
    headers: {
      'X-Authorization': sessionToken,
    },
  });

  let returnValue = null;

  switch (response.status) {
    case 200:
      returnValue = { ok: true, message: 'successful logout.' };
      break;
    case 401:
      returnValue = {
        ok: false,
        message: 'not authorised to perform this action.',
      };
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
 * Get user data.
 * @param {Object} request Request data.
 * @param {number} userId ID of user to get.
 * @param {string} sessionToken Authorisation token from logged in user.
 * @returns A parsed response object.
 */
export async function getUser({ userId, sessionToken }) {
  const response = await fetch(url(`user/${userId}`), {
    headers: {
      'X-Authorization': sessionToken,
    },
  });

  let returnValue = null;

  switch (response.status) {
    case 200:
      returnValue = {
        ok: true,
        message: 'got user data.',
        body: camelcase(await response.json()),
      };
      break;
    case 401:
      returnValue = {
        ok: false,
        message: 'unauthorised to perform this action.',
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
 * Update a user's data.
 * @param {Object} request Request data.
 * @param {number} userId ID of user to update.
 * @param {string} sessionToken Authorisation token from logged in user.
 * @param {Object} user Data fields of user to update.
 * @returns A parsed response object.
 */
export async function updateUser({ userId, sessionToken, user: { firstName, lastName } }) {
  const response = await fetch(url(`user/${userId}`), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization': sessionToken,
    },
    body: JSON.stringify({ first_name: firstName, last_name: lastName }),
  });

  let returnValue = null;

  switch (response.status) {
    case 200:
      returnValue = { ok: true, message: 'updated user.' };
      break;
    case 400:
      returnValue = { ok: false, message: 'invalid data to update user.' };
      break;
    case 401:
      returnValue = { ok: false, message: 'not authorised to perform this action.' };
      break;
    case 403:
      returnValue = { ok: false, message: 'only able to update your own profile.' };
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
 * Get profile photo of user.
 * @param {Object} request Request data.
 * @param {number} request.userId ID of user to get profile photo of.
 * @param {string} request.sessionToken Authorisation token from logged in user.
 * @returns A parsed response object.
 */
export async function getProfilePhoto({ userId, sessionToken }) {
  const response = await fetch(url(`user/${userId}/photo`), {
    headers: {
      'X-Authorization': sessionToken,
    },
  });

  let returnValue = null;

  switch (response.status) {
    case 200:
      returnValue = {
        ok: true,
        message: 'got user profile picture.',
        body: await response.blob(),
      };
      break;
    case 401:
      returnValue = {
        ok: false,
        message: 'unauthorised to perform this action.',
      };
      break;
    case 404:
      returnValue = { ok: false, message: 'no user / profile picture found.' };
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
 * Upload a profile photo for the user.
 * @param {Object} request Request data.
 * @param {number} request.userId ID of user to upload profile photo for.
 * @param {string} request.sessionToken Authorisation token from logged in user.
 * @param {Blob} request.photo Blob data of photo to upload.
 * @returns A parsed response object.
 */
export async function uploadProfilePhoto({ userId, sessionToken, photo }) {
  const response = await fetch(url(`user/${userId}/photo`), {
    method: 'POST',
    headers: {
      'Content-Type': photo.type,
      'X-Authorization': sessionToken,
    },
    body: photo,
  });

  let returnValue = null;

  switch (response.status) {
    case 200:
      returnValue = { ok: true, message: 'uploaded profile picture.' };
      break;
    case 400:
      returnValue = { ok: false, message: 'invalid data to upload profile picture.' };
      break;
    case 401:
      returnValue = { ok: false, message: 'not authorised to perform this action.' };
      break;
    case 404:
      returnValue = { ok: false, message: 'no user / profile picture found' };
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
 * Get friends of specified user.
 * @param {Object} request Request data.
 * @param {number} request.userId ID of user to get friends of.
 * @param {string} request.sessionToken Authorisation token from logged in user.
 * @returns A parsed response object.
 */
export async function getFriends({ userId, sessionToken }) {
  const response = await fetch(url(`user/${userId}/friends`), {
    headers: {
      'X-Authorization': sessionToken,
    },
  });

  let returnValue = null;

  switch (response.status) {
    case 200:
      returnValue = { ok: true, message: 'got friends', body: camelcase(await response.json()) };
      break;
    case 401:
      returnValue = { ok: false, message: 'not authorised to perform this action.' };
      break;
    case 403:
      returnValue = { ok: false, message: 'can only view friends of yourself or friends.' };
      break;
    case 404:
      returnValue = { ok: false, message: 'no user / friends found.' };
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
 * Searches for users in the system.
 * @param {Object} request Request data.
 * @param {string} request.sessionToken Authorisation token from logged in user.
 * @param {string} request.query Query string to use in search.
 * @param {number} request.offset Index offset to start collating results.
 * @param {number} request.limit Maximum number of search results to return.
 * @param {number} request.searchIn Type of results to search for (`all` or `friends`).
 * @returns A parsed response object.
 */
export async function searchUsers({
  sessionToken, query, offset, limit = 20, searchIn = 'all',
}) {
  const response = await fetch(url(`search?q=${query}&search_in=${searchIn}&limit=${limit}&offset=${offset}`), {
    headers: {
      'X-Authorization': sessionToken,
    },
  });

  let returnValue = null;

  switch (response.status) {
    case 200:
      returnValue = { ok: true, message: 'got results', body: camelcase(await response.json()) };
      break;
    case 400:
      returnValue = { ok: false, message: 'invalid data to perform search.' };
      break;
    case 401:
      returnValue = { ok: false, message: 'not authorised to perform this action.' };
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
      returnValue = { ok: true, message: 'got posts.', body: camelcase(await response.json(), { deep: true }) };
      break;
    case 401:
      returnValue = { ok: false, message: 'not authorised to perform this action.' };
      break;
    case 403:
      returnValue = { ok: false, message: 'can only view the posts of yourself or your friends.' };
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
      returnValue = { ok: true, message: 'got post.', body: camelcase(await response.json(), { deep: true }) };
      break;
    case 401:
      returnValue = { ok: false, message: 'not authorised to perform this action.' };
      break;
    case 403:
      returnValue = { ok: false, message: 'can only view the posts of yourself or your friends.' };
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
export async function updatePost({
  userId, postId, sessionToken, post,
}) {
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
      returnValue = { ok: false, message: 'not authorised to perform this action.' };
      break;
    case 403:
      returnValue = { ok: false, message: 'you can only update your own posts.' };
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
      returnValue = { ok: false, message: 'not authorised to perform this action.' };
      break;
    case 403:
      returnValue = { ok: false, message: 'you can only delete your own posts.' };
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
      returnValue = { ok: false, message: 'this post has already been liked.', body: { isAlreadyLiked: true } };
      break;
    case 401:
      returnValue = { ok: false, message: 'not authorised to perform this action.' };
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
      returnValue = { ok: false, message: 'this post has already been unliked.', body: { isAlreadyUnliked: true } };
      break;
    case 401:
      returnValue = { ok: false, message: 'not authorised to perform this action.' };
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
