import camelcase from 'camelcase-keys';
import url from './utils';

export async function getFriends({ userId, sessionToken }) {
  const response = await fetch(url(`user/${userId}/friends`), {
    headers: {
      'X-Authorization': sessionToken,
    },
  });

  let returnValue = null;

  switch (response.status) {
    case 200:
      returnValue = {
        ok: true,
        message: 'got friends',
        body: camelcase(await response.json()),
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
        message: 'can only view friends of yourself or friends.',
      };
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

export async function addFriend({ userId, sessionToken }) {
  const response = await fetch(url(`user/${userId}/friends`), {
    method: 'POST',
    headers: {
      'X-Authorization': sessionToken,
    },
  });

  let returnValue = null;

  switch (response.status) {
    case 201:
      returnValue = { ok: true, message: 'sent friend request.' };
      break;
    case 401:
      returnValue = { ok: false, message: 'not authorised to perform this action.' };
      break;
    case 403:
      returnValue = { ok: false, message: 'user is already added as a friend.' };
      break;
    case 404:
      returnValue = { ok: false, message: 'no user found.' };
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

export async function getFriendRequests({ sessionToken }) {
  const response = await fetch(url('friendrequests'), {
    headers: {
      'X-Authorization': sessionToken,
    },
  });

  let returnValue = null;

  switch (response.status) {
    case 200:
      returnValue = {
        ok: true,
        message: 'got friend requests.',
        body: camelcase(await response.json()),
      };
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

export async function acceptFriendRequest({ userId, sessionToken }) {
  const response = await fetch(url(`friendrequests/${userId}`), {
    method: 'POST',
    headers: {
      'X-Authorization': sessionToken,
    },
  });

  let returnValue = null;

  switch (response.status) {
    case 200:
      returnValue = { ok: true, message: 'accepted friend request.' };
      break;
    case 401:
      returnValue = { ok: false, message: 'not authorised to perform this action.' };
      break;
    case 404:
      returnValue = { ok: false, message: 'user not found.' };
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

export async function declineFriendRequest({ userId, sessionToken }) {
  const response = await fetch(url(`friendrequests/${userId}`), {
    method: 'DELETE',
    headers: {
      'X-Authorization': sessionToken,
    },
  });

  let returnValue = null;

  switch (response.status) {
    case 200:
      returnValue = { ok: true, message: 'accepted friend request.' };
      break;
    case 401:
      returnValue = { ok: false, message: 'not authorised to perform this action.' };
      break;
    case 404:
      returnValue = { ok: false, message: 'user not found.' };
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

export async function searchUsers({ sessionToken, query, offset, limit = 20, searchIn = 'all' }) {
  const response = await fetch(
    url(`search?q=${query}&search_in=${searchIn}&limit=${limit}&offset=${offset}`),
    {
      headers: {
        'X-Authorization': sessionToken,
      },
    }
  );

  let returnValue = null;

  switch (response.status) {
    case 200:
      returnValue = {
        ok: true,
        message: 'got results',
        body: camelcase(await response.json()),
      };
      break;
    case 400:
      returnValue = { ok: false, message: 'invalid data to perform search.' };
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
