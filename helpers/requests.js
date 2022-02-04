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
        body: await response.json(),
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
        body: await response.json(),
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
    case 200: {
      const json = await response.json();
      returnValue = {
        ok: true,
        message: 'got user data.',
        body: {
          id: json.user_id,
          email: json.email,
          firstName: json.first_name,
          lastName: json.last_name,
          friendCount: json.friend_count,
        },
      };
      break;
    }
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
        body: await response.json(),
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
