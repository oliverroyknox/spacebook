import camelcase from 'camelcase-keys';
import url from './utils';

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

export async function signup({ email, password, firstName, lastName }) {
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
      returnValue = {
        ok: false,
        message: 'not authorised to perform this action.',
      };
      break;
    case 403:
      returnValue = {
        ok: false,
        message: 'only able to update your own profile.',
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
      returnValue = {
        ok: false,
        message: 'invalid data to upload profile picture.',
      };
      break;
    case 401:
      returnValue = {
        ok: false,
        message: 'not authorised to perform this action.',
      };
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
