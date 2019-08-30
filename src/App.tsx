import React from 'react';

import { root } from 'ducks/rootDuck';
import { ConnectedTodoList } from 'components/TodoList';

const App: React.FC = () => {
  return (
    <div className="container">
      <ConnectedTodoList todoDuck={root.nested.thing} />
    </div>
  );
};

export default App;
