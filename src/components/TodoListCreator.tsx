import React, { useState } from 'react';

interface TodoListCreatorProps {
  createList: (title: string) => void;
}
export const TodoListCreator: React.FC<TodoListCreatorProps> = props => {
  const [ title, setTitle ] = useState('');

  const onSubmit: React.FormEventHandler = e => {
    e.preventDefault();
    props.createList(title);
    setTitle('');
  };

  return (
    <form onSubmit={onSubmit}>
      <h2>Create New List</h2>
      <label>
        What would you like to call your list?
        <input value={title} onChange={e => setTitle(e.currentTarget.value)} />
      </label>
      <button>Create</button>
    </form>
  );
};
