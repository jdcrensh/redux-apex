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
    try {
      dispatch(actions.remoteActionRequest({ method, params }));
      const res = await remoteAction(controller, method, getActionFn)(
        ...params
      );
      dispatch(actions.remoteActionSuccess({ method, res }));
    } catch (err) {
      dispatch(
        actions.remoteActionFailure({ method, err: serializeError(err) })
      );
    }
  };
}
