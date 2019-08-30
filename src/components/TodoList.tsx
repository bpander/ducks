import React, { useState } from 'react';
import { connect } from 'react-redux';
import { AnyAction, bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { Todo, TodoDuck } from 'ducks/todoDuck';

export interface TodoListProps {
  title: string;
  list: Todo[];
  addTodo: (description: string) => void;
  toggleComplete: (todo: Todo) => void;
  remove: (todo: Todo) => void;
}

export const TodoList: React.FC<TodoListProps> = props => {
  const [ description, setDescription ] = useState('');

  const onSubmit: React.FormEventHandler = e => {
    e.preventDefault();
    props.addTodo(description);
    setDescription('');
  };

  return (
    <div className="todo-list">
      <h2>{props.title || 'Todo List'}</h2>
      <form onSubmit={onSubmit}>
        <label>What needs to be done?</label>
        <div className="flex">
          <div className="flex-grow">
            <input
              value={description}
              className="w-100"
              placeholder="e.g. Buy milk"
              onChange={e => setDescription(e.currentTarget.value)}
            />
          </div>
          <div className="pl-2">
            <button>Add</button>
          </div>
        </div>
      </form>
      <table className="todo-list__table">
        <thead>
          <tr>
            <th>Complete?</th>
            <th className="todo-list__th--description">Description</th>
            <th>Remove?</th>
          </tr>
        </thead>
        <tbody>
          {props.list.map(todo => (
            <tr key={todo.id}>
              <td>
                <input
                  type="checkbox"
                  checked={todo.complete}
                  onChange={() => props.toggleComplete(todo)}
                />
              </td>
              <td className={(todo.complete) ? 'line-through' : ''}>{todo.description}</td>
              <td><button type="button" onClick={() => props.remove(todo)}>x</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

interface OwnProps { todoDuck: TodoDuck }

const mapStateToProps = (rootState: any, ownProps: OwnProps) => {
  const todoListState = ownProps.todoDuck.getBranch(rootState);
  return {
    title: todoListState.title,
    list: todoListState.list,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, {}, AnyAction>, ownProps: OwnProps) => bindActionCreators({
  addTodo: ownProps.todoDuck.addTodo,
  toggleComplete: ownProps.todoDuck.toggleComplete,
  remove: ownProps.todoDuck.remove,
}, dispatch);

export const ConnectedTodoList = connect(mapStateToProps, mapDispatchToProps)(TodoList);
