import * as types from './types';

export function remoteActionRequest(payload = {}) {
  return { type: types.REMOTE_ACTION_REQUEST, payload };
}

export function remoteActionSuccess(payload = {}) {
  return { type: types.REMOTE_ACTION_SUCCESS, payload };
}

export function remoteActionFailure(payload = {}) {
  return { type: types.REMOTE_ACTION_FAILURE, payload };
}
