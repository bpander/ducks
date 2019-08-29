import { AnyAction, Reducer, combineReducers, createStore, applyMiddleware, Store, ReducersMapObject } from 'redux';
import thunk, { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { createReducer } from './createReducer';

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

interface Dictionary<T> {
  [key: string]: T;
}

const keys = <T>(obj: T) => Object.keys(obj) as Array<keyof T>;

// type extractGeneric<Type> = Type extends TypeWithGeneric<infer X> ? X : never

type ExtractState<TDuck> = TDuck extends Duck<infer S> ? S : never;

export const combineDucks = <M extends { [key: string]: DuckCreator<any> }>(duckCreators: M) => {
  return (getBranch: GetBranch<{ [K in keyof M]: ExtractState<ReturnType<M[K]>>}>) => {
    // const duck: { [K in keyof X]: ReturnType<X[K]> } & Duck<S> = {} as any;
    const reducers: ReducersMapObject<{ [K in keyof M]: ExtractState<ReturnType<M[K]>>}> = {} as any;
    const extras: { [K in keyof M]: ReturnType<M[K]> } = {} as any;
    keys(duckCreators).forEach(key => {
      extras[key] = duckCreators[key](state => getBranch(state)[key]) as ReturnType<M[typeof key]>;
      reducers[key] = extras[key].reducer;
    });
    // const foo = mapObject(duckCreators, (duckCreator, key) => {
    //   const subDuck = duckCreator(state => getBranch(state)[key]);
    //   // duck[key] = duckCreator(state => getBranch(state)[key]);
    // });
    const reducer = combineReducers(reducers);
    return { reducer, ...extras };
  };
};


const duck = <S, TExtras>(reducer: Reducer<S>, extras: (getBranch: GetBranch<S>) => TExtras) => {
  return (getBranch: GetBranch<S>): Duck<S> & TExtras => {
    return {} as any;
  };
};




type Thing = { id: string; name: string }
type ThingState = { cache: Thing[] }
const initialState: ThingState = { cache: [] };

const thingDuck = (prefix = 'THING') => {
  const { update, reducer } = createReducer(prefix + '/UPDATE', initialState);

  return duck(reducer, getBranch => ({
    addThing: <S>(thing: Thing): ThunkAction<void, S, {}, AnyAction> => (dispatch, getState) => {
      const cache = [ ...getBranch(getState()).cache, thing ];
      dispatch(update({ cache }));
    },
  }));
};
const foo = thingDuck('test');
type X = ExtractState<ReturnType<typeof foo>>;

// const thingDuck = (prefix = 'THING') => (getBranch: GetBranch<ThingState>): Duck<ThingState> => {
//   const reducer: Reducer<ThingState> = (state = initialState, action) => {
//     if (action.type === prefix + '/SET_CACHE') {
//       return { ...state, cache: action.payload };
//     }
//     return state;
//   };
//   return {
//     reducer,
//     addThing: <S>(thing: Thing): ThunkAction<void, S, {}, AnyAction> => (dispatch, getState) => {
//       const cache = [ ...getBranch(getState()).cache, thing ];
//       dispatch({ type: prefix + '/SET_CACHE', payload: cache })
//     },
//   };
// };

const root = combineDucks({
  thing: thingDuck(),
  nested: combineDucks({
    thing: thingDuck('SOME_ACTION_PREFIX'),
  }),
})(s => s);

type RootState = ExtractState<typeof root>;

type ThunkStore<T> = Store<T> & { dispatch: ThunkDispatch<RootState, {}, AnyAction> };

const store = createStore(root.reducer, applyMiddleware(thunk)) as ThunkStore<RootState>;
store.dispatch(root.nested.thing.addThing({ id: '1', name: 'nested one' }));
store.dispatch(root.thing.addThing({ id: '2', name: 'one' }));
store.dispatch(root.thing.addThing({ id: '3', name: 'two' }));
console.log(store.getState());
