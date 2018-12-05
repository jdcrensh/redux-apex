import serializeError from 'serialize-error';
import promisify from 'promisify-remote-actions';
import * as actions from './actions';

const remoteAction = (controller, method, getActionFn) => {
  const actionFn =
    (typeof getActionFn === 'function' && getActionFn(controller, method)) ||
    (window[controller] && window[controller][method]);
  if (!actionFn) {
    throw new Error(`Remote action not defined: ${method}`);
  }
  return promisify(actionFn);
};

export function createRemoteAction(controller, getActionFn) {
  return method => (...params) => async dispatch => {
    let res;
    const payload = { controller, method, params };
    try {
      dispatch(actions.remoteActionRequest(payload));
      res = await remoteAction(controller, method, getActionFn)(...params);
      dispatch(actions.remoteActionSuccess({ ...payload, res }));
    } catch (err) {
      dispatch(
        actions.remoteActionFailure({ ...payload, err: serializeError(err) })
      );
    }
    return res;
  };
}
