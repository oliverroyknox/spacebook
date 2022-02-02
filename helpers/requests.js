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
 * @param {Object} body Request body.
 * @param {string} body.email Email of user account.
 * @param {string} body.password Password for user account.
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
      returnValue = { ok: true, message: 'successful login.', body: await response.json() };
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
 * @param {*} body Request body.
 * @param {string} body.email Email of user account.
 * @param {string} body.password Password of user account.
 * @param {string} body.firstName First name of user.
 * @param {string} body.lastName Last name of user.
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
      email, password, first_name: firstName, last_name: lastName,
    }),
  });

  let returnValue = null;

  switch (response.status) {
    case 201:
      returnValue = { ok: true, message: 'successful signup.', body: await response.json() };
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
