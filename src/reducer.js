import * as types from './types';

export default (state = {}, { type, payload }) => {
  switch (type) {
    case types.REMOTE_ACTION_REQUEST:
      return {
        ...state,
        [payload.method]: {
          loading: true,
          status: true,
          started: new Date().getTime(),
        },
      };
    case types.REMOTE_ACTION_SUCCESS:
      return {
        ...state,
        [payload.method]: {
          res: payload.res,
          loading: false,
          status: true,
          started: state[payload.method].started,
          completed: new Date().getTime(),
        },
      };
    case types.REMOTE_ACTION_FAILURE:
      return {
        ...state,
        [payload.method]: {
          err: payload.err.message,
          loading: false,
          status: false,
          started: state[payload.method].started,
          completed: new Date().getTime(),
        },
      };
    default:
      return state;
  }
};
