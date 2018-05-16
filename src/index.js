export { default as remoteActionReducer } from './reducer';

export { createRemoteAction } from './operations';

export {
  getRemoteActionState,
  getRemoteActionResult,
  getRemoteActionError,
  getRemoteActionStatus,
  getRemoteActionLoading,
  getRemoteActionStarted,
  getRemoteActionCompleted,
} from './selectors';

export {
  REMOTE_ACTION_REQUEST,
  REMOTE_ACTION_SUCCESS,
  REMOTE_ACTION_FAILURE,
} from './types';
