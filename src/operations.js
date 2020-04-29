import { serializeError } from 'serialize-error';
import promisify from 'promisify-remote-actions';
import * as actions from './actions';

const remoteAction = (controller, method, config, getActionFn) => {
  if (typeof config === 'function') {
    getActionFn = config;
  }
  const actionFn =
    (typeof getActionFn === 'function' && getActionFn(controller, method)) ||
    (window[controller] && window[controller][method]);
  if (!actionFn) {
    throw new Error(`Remote action not defined: ${method}`);
  }
  return promisify(actionFn, config);
};

export function createRemoteAction(controller, config, getActionFn) {
  if (typeof config === 'function') {
    getActionFn = config;
    config = {};
  }
  return (method, config2 = {}) => (...params) => async (dispatch) => {
    let res;
    const payload = { controller, method, params };
    try {
      dispatch(actions.remoteActionRequest(payload));
      res = await remoteAction(
        controller,
        method,
        { ...config, ...config2 },
        getActionFn
      )(...params);
      dispatch(actions.remoteActionSuccess({ ...payload, res }));
    } catch (err) {
      dispatch(
        actions.remoteActionFailure({ ...payload, err: serializeError(err) })
      );
    }
    return res;
  };
}
