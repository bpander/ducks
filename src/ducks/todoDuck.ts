import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { createReducer } from 'lib/createReducer';

export type Todo = { id: string; description: string; complete: boolean }
export type TodoState = { list: Todo[]; title: string }

export const emptyTodoState: TodoState = { list: [], title: '' };

export const todoDuck = (prefix: string, getBranch: <S>(rootState: S) => TodoState) => {
  const { update, reducer } = createReducer(prefix + '/UPDATE', emptyTodoState);

  return {
    reducer,
    getBranch,

    addTodo: <S>(description: string): ThunkAction<void, S, {}, AnyAction> => (dispatch, getState) => {
      const state = getBranch(getState());
      const todo: Todo = {
        description,
        id: String(state.list.length + 1),
        complete: false,
      };
      const list = [ ...getBranch(getState()).list, todo ];
      dispatch(update({ list }));
    },

    toggleComplete: <S>(todo: Todo): ThunkAction<void, S, {}, AnyAction> => (dispatch, getState) => {
      const state = getBranch(getState());
      const list = state.list.map(t => (t.id === todo.id) ? { ...todo, complete: !todo.complete } : t);
      dispatch(update({ list }));
    },

    remove: <S>(todo: Todo): ThunkAction<void, S, {}, AnyAction> => (dispatch, getState) => {
      const state = getBranch(getState());
      const list = state.list.filter(t => t.id !== todo.id);
      dispatch(update({ list }));
    },

    setTitle: (title: string) => update({ title }),

    getCompleted: <S>(state: S) => getBranch(state).list.filter(t => t.complete).length,
  };
};

export type TodoDuck = ReturnType<typeof todoDuck>;
