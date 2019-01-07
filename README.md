# redux-apex

[![npm package][npm-badge]][npm]

Simple Redux bindings for JavaScript Remoting in Salesforce

## Install

`yarn add redux-apex redux-thunk`

## Usage

### Reducer

The reducer is exported as `remoteActionReducer`. Selectors expect data to be located on the `apex` slice in state, eg:

```js
import { combineReducers } from 'redux';
import { remoteActionReducer } from 'redux-apex';

const reducer = combineReducers({
  ...reducers,
  apex: remoteActionReducer
});
```

State tree:
```json
{
  "apex": {
    "fetchAccounts": {
      "res": [
        {
          "Id": "xxxxxxxxxx",
          "Name": "My Account"
        }
      ],
      "loading": false,
      "status": true,
      "started": 123456789,
      "completed": 123456789
    }
  }
}
```

### Types

The package exports three action type constants. You should use these in your own reducer for loading data into your store.

```js
import {
  REMOTE_ACTION_REQUEST,
  REMOTE_ACTION_SUCCESS,
  REMOTE_ACTION_FAILURE,
} from 'redux-apex';
```

### Actions

Return value of action creators (to be consumed by your reducer)

```
type: REMOTE_ACTION_REQUEST
payload: { controller, method, params }

type: REMOTE_ACTION_SUCCESS
payload: { controller, method, params, res }

type: REMOTE_ACTION_FAILURE
payload: { controller, method, params, err }
```

### Operations

An operation factory is exported that can be used to create a dispatchable [thunk](https://github.com/reduxjs/redux-thunk) for each remote method on the backing Apex controller. The resulting operations dispatch `REQUEST`, `SUCCESS`, and `FAILURE` actions that are sent to the `remoteActionReducer`.

`modules/apex/methods.js` (optional)
```js
export const FETCH_ACCOUNTS = 'fetchAccounts';
export const FETCH_CONTACTS = 'fetchContacts';
export const SAVE = 'save';
```

`modules/apex/operations.js`
```js
import { createRemoteAction } from 'redux-apex';
import * as methods from './methods';

const ctrl = 'MyController'; // name of the apex controller
const factory = createRemoteAction(ctrl);

export const fetchAccounts = factory(methods.FETCH_ACCOUNTS);
export const fetchContacts = factory(methods.FETCH_CONTACTS);
export const save = factory(methods.SAVE);
```

#### Development/Test Mocking

The `createRemoteAction` factory can take an optional function as its second argument that will intercept the remote action call. This can be used for mocking in development or test environments.

`modules/apex/remoting.mock.js`
```js
const accounts = {
  '001000000000001': {
    Id: '001000000000001',
    Name: 'Foo',
  },
  '001000000000002': {
    Id: '001000000000002',
    Name: 'Bar',
  },
};

const MockController = {
  async fetchAccount(id) {
    return accounts[id];
  },
};

export default (controller, method) => (...args) => {
  const data = args.slice(0, -2);
  const [callback] = args.slice(-2, -1);

  if (!MockController[method]) {
    throw new Error(`method not implemented in mock: ${controller}.${method}`);
  }
  MockController[method](...data).then(res => {
    callback(res, { status: true });
  });
};
```

`modules/apex/operations.js`
```diff
-const factory = createRemoteAction(ctrl);
+const factory = createRemoteAction(
+  ctrl,
+  process.env.NODE_ENV !== 'production' ? require('./remoting.mock'): null
+);
```

### Selectors

There are a number of selector factories that can be used for accessing any piece of the `apex` state. Each one takes the remote action method name and returns a new selector that takes the redux state.

- `getState(state)` {object} the full `apex` state
- `getRemoteActionState(method)(state)` {object} the remote action's full state
- `getRemoteActionResult(method, defaultValue)(state)` {any} the most recent return value of the remote action
- `getRemoteActionError(method)(state)` {any} the most recent error of the remote action
- `getRemoteActionStatus(method)(state)` {boolean} the status where `false` is a failure
- `getRemoteActionLoading(method)(state)` {boolean} loading status
- `getRemoteActionStarted(method)(state)` {integer} date in milliseconds when last called
- `getRemoteActionCompleted(method)(state)` {integer} date in milliseconds when last completed

### Usage by a connected component

Use the operations and selectors in your connected component:

`components/App/AppContainer.js`
```js
import * as apexOperations from 'modules/apex/operations';
import * as apexSelectors from 'modules/apex/selectors';
import App from './App';

const mapState = state => ({
  isSaving: apexSelectors.isSaving(state),
});

const mapActions = {
  fetchAccounts: apexOperations.fetchAccounts,
  fetchContacts: apexOperations.fetchContacts,
  save: apexOperations.save,
};

export default connect(mapState, mapActions)(App);
```

[npm-badge]: https://img.shields.io/npm/v/redux-apex.png?style=flat-square
[npm]: https://www.npmjs.org/package/redux-apex
