# redux-apex
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

const ctrl = window.MyController; // reference to the global javascript remoting controller

export const fetchAccounts = createRemoteAction(ctrl)(methods.FETCH_ACCOUNTS);
export const fetchContacts = createRemoteAction(ctrl)(methods.FETCH_CONTACTS);
export const save = createRemoteAction(ctrl)(methods.SAVE);
```

### Selectors

There are a number of selector factories that can be used for accessing any piece of the `apex` state. Each one takes the remote action method name and returns a new selector that takes the redux state.

- `getState(state)` {object} the full `apex` state
- `getRemoteActionState(method)(state)` {object} the remote action's full state
- `getRemoteActionResult(method)(state)` {any} the most recent return value of the remote action
- `getRemoteActionError(method)(state)` {string} the most recent error of the remote action
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
