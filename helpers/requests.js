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
      returnValue = { ok: false };
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
      returnValue = { ok: false };
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
      returnValue = { ok: false };
      break;
  }

  return returnValue;
}

/**
 * Get user data.
 * @param {Object} request Request data.
 * @param {string} userId ID of user to get.
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
      returnValue = { ok: false };
      break;
  }

  return returnValue;
}

/**
 * Get profile photo of user.
 * @param {Object} request Request data.
 * @param {string} request.userId ID of user to get profile photo of.
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
      returnValue = { ok: false, message: 'no profile picture found.' };
      break;
    case 500:
      returnValue = { ok: false, message: 'unable to reach server.' };
      break;
    default:
      returnValue = { ok: false };
      break;
  }

  return returnValue;
}

/**
 * Get a list of posts for a given user.
 * @param {Object} request Request data.
 * @param {string} request.userId ID of user to get posts of.
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
      returnValue = { ok: false };
      break;
  }

  return returnValue;
}

/**
 * Create a new post on the given user's profile.
 * @param {Object} request Request data.
 * @param {string} request.userId ID of the user to create a post on their page.
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
      returnValue = { ok: false };
      break;
  }

  return returnValue;
}

/**
 * Get a post on a given user's profile.
 * @param {Object} request Request data.
 * @param {string} userId ID of the user to create a post on their page.
 * @param {string} postId ID of the post to get.
 * @param {string} sessionToken Authorisation token from logged in user.
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
      returnValue = { ok: false };
      break;
  }

  return returnValue;
}

/**
 * Update a post on a given user's profile.
 * @param {Object} request Request data.
 * @param {string} request.userId ID of the user who's profile the post to be updated is located.
 * @param {string} request.postId ID of the post to update.
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
      returnValue = { ok: false };
      break;
  }

  return returnValue;
}

/**
 * Likes a post on a user's profile.
 * @param {Object} request Request data.
 * @param {string} request.userId ID of the user's profile.
 * @param {string} request.postId ID of post to like.
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
      returnValue = { ok: true, message: 'liked post.', body: await response.json() };
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
      returnValue = { ok: false };
      break;
  }

  return returnValue;
}

/**
 * Unlikes a post on a user's profile.
 * @param {Object} request Request data.
 * @param {string} request.userId ID of the user's profile.
 * @param {string} request.postId ID of post to unlike.
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
      returnValue = { ok: true, message: 'unliked post.', body: await response.json() };
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
      returnValue = { ok: false };
      break;
  }

  return returnValue;
}
