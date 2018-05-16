export const getState = state => state.apex || {};

export const getRemoteActionState = method => state =>
  getState(state)[method] || {};

export const getRemoteActionResult = method => state =>
  getRemoteActionState(method)(state).res;

export const getRemoteActionError = method => state =>
  getRemoteActionState(method)(state).err;

export const getRemoteActionStatus = method => state => {
  const status = getRemoteActionState(method)(state).status;
  return status == null || status;
};

export const getRemoteActionLoading = method => state =>
  !!getRemoteActionState(method)(state).loading;

export const getRemoteActionStarted = method => state =>
  getRemoteActionState(method)(state).started;

export const getRemoteActionCompleted = method => state =>
  getRemoteActionState(method)(state).completed;
