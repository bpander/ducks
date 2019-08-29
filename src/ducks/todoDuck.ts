import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { createReducer } from 'lib/createReducer';
import { duck } from 'lib/ducks';

export type Todo = { id: string; description: string; complete: boolean }
export type TodoState = { list: Todo[] }

export const emptyTodoState: TodoState = { list: [] };

export const todoDuck = (prefix = 'TODO') => {
  const { update, reducer } = createReducer(prefix + '/UPDATE', emptyTodoState);

  return duck(reducer, getBranch => ({
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
  }));
};
