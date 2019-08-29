import { AnyAction, Reducer, combineReducers, createStore, applyMiddleware } from 'redux';
import thunk, { ThunkAction } from 'redux-thunk';

export type GetBranch<T> = (rootState: any) => T;

export interface Duck<T> {
  reducer: Reducer<T, AnyAction>;
}
export interface DuckCreator<T> {
  (getBranch: GetBranch<T>): Duck<T>;
}

export type DuckCreatorsMapObject<S> = {
  [K in keyof S]: DuckCreator<S[K]>;
}

export const combineDuckCreators = <S>(duckCreators: DuckCreatorsMapObject<S>) => {
  return (getBranch: GetBranch<S>) => {
    const duck: any = {};
    const reducers: any = {};
    for (const key in duckCreators) {
      duck[key] = duckCreators[key](state => getBranch(state)[key]);
      reducers[key] = duck[key].reducer;
    }
    duck.reducer = combineReducers(reducers);
    return duck;
  };
};





type Thing = { id: string; name: string }
type ThingState = { cache: Thing[] }
const initialState: ThingState = { cache: [] };
const thingDuckCreator = (prefix = 'THING') => (getBranch: GetBranch<ThingState>) => {
  const reducer: Reducer<ThingState> = (state = initialState, action) => {
    if (action.type === prefix + '/SET_CACHE') {
      return { ...state, cache: action.payload };
    }
    return state;
  };
  return {
    reducer,
    addThing: <S>(thing: Thing): ThunkAction<void, S, {}, AnyAction> => (dispatch, getState) => {
      const cache = [ ...getBranch(getState()).cache, thing ];
      dispatch({ type: prefix + '/SET_CACHE', payload: cache })
    },
  };
};

const root = combineDuckCreators({
  thing: thingDuckCreator(),
  nested: combineDuckCreators({
    thing: thingDuckCreator('SOME_ACTION_PREFIX'),
  }),
})(s => s);


const store = createStore(root.reducer, applyMiddleware(thunk));
store.dispatch(root.nested.thing.addThing({ id: '1', name: 'nested one' }));
store.dispatch(root.thing.addThing({ id: '2', name: 'one' }));
store.dispatch(root.thing.addThing({ id: '3', name: 'two' }));
console.log(store.getState());
