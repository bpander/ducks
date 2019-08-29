import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { createReducer } from 'lib/createReducer';

export type Todo = { id: string; description: string; complete: boolean }
export type TodoState = { list: Todo[]; layout: string }

export const emptyTodoState: TodoState = { list: [], layout: '' };

export const todoDuck = (prefix: string, getBranch: <S>(rootState: S) => TodoState) => {
  const { update, reducer } = createReducer(prefix + '/UPDATE', emptyTodoState);

  return {
    reducer,

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

    getCompleted: <S>(state: S) => getBranch(state).list.filter(t => t.complete).length,
  };
};
