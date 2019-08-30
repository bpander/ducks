# Why does this exist?

TODO

# Example

A simple "todo list" duck:

```typescript
type Todo = { name: string; complete: boolean };
type TodoState = { title: string; list: Todo[] };

const initialState: TodoState = { title: '', list: [] };

const todoDuck = (prefix: string, getBranch: <S>(rootState: S) => TodoState) => {
  const SET_TITLE = prefix + '/SET_TITLE';

  const reducer: Reducer<TodoState> = (state = initialState, action) => {
    switch (action.type) {
      case SET_TITLE: return { ...state, title: action.payload };
    }
    return state;
  };

  const setTitle = (title: string) => ({ type: SET_TITLE, payload: title });

  const getCompleted = createSelector(
    <S>(rootState: S) => getBranch(rootState).list,
    list => list.filter(todo => todo.complete),
  );

  return { reducer, setTitle, getCompleted };
};
```

Consuming ducks:

```typescript
export const root = combineDucks({
  workTodoList: todoDuck,
  homeStuff: combineDucks({
    todoList: todoDuck,
  }),
})('', s => s);

const store = createStore(root.reducer);
store.dispatch(root.workTodoList.setTitle('title'));
console.log(root.homeStuff.todoList.getCompleted(store.getState()));
```
