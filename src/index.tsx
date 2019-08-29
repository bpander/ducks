import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, Store, AnyAction } from 'redux';
import { Provider } from 'react-redux';
import thunk, { ThunkDispatch } from 'redux-thunk';

import App from 'App';
import { root, RootState } from 'ducks/rootDuck';

import 'index.css';

type ThunkStore<T> = Store<T> & { dispatch: ThunkDispatch<RootState, {}, AnyAction> };

const store = createStore(root.reducer, applyMiddleware(thunk)) as ThunkStore<RootState>;
store.dispatch(root.nested.thing.addTodo('nested one'));
store.dispatch(root.thing.addTodo('one'));
store.dispatch(root.thing.addTodo('two'));
console.log(store.getState());
console.log(root.nested.thing.getCompleted(store.getState()));
console.log(root.thing.getCompleted(store.getState()));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
