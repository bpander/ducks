import React from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { root, RootState } from 'ducks/rootDuck';
import { ConnectedTodoList } from 'components/TodoList';
import { TodoListCreator } from 'components/TodoListCreator';

type AppProps = Pick<RootState, 'keyedSubState'> & { dispatch: ThunkDispatch<RootState, {}, AnyAction> };

const App: React.FC<AppProps> = props => {

  const createList = (title: string) => {
    props.dispatch(root.keyedSubState.get(title).foo.setTitle(title));
  };

  return (
    <div className="container">
      <ConnectedTodoList todoDuck={root.thing} />
      <ConnectedTodoList todoDuck={root.nested.thing} />
      {Object.keys(props.keyedSubState).map(key => (
        <ConnectedTodoList key={key} todoDuck={root.keyedSubState.get(key).foo} />
      ))}
      <TodoListCreator createList={createList} />
    </div>
  );
};

export default connect((state: RootState) => ({ keyedSubState: state.keyedSubState }))(App);
