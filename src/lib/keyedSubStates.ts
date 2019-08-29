import { DuckCreator, combineDucks, ExtractState } from 'lib/ducks';
import { Reducer } from 'redux';

interface Dictionary<T> {
  [key: string]: T;
}

export const keyedSubStates = <M extends { [key: string]: DuckCreator<any> }>(map: M) => {
  return  (prefix: string, getBranch: (rootState: any) => Dictionary<ExtractState<M>>) => {
    const duckCreator = combineDucks(map);
    const subStateDuck = duckCreator('', s => s);

    const reducer: Reducer<Dictionary<{ [K in keyof M]: ReturnType<M[K]> }>> = (state = {}, action) => {
      if (action.type.startsWith(prefix)) {
        const [ , key, childAction ] = action.type.replace(prefix, '').split(/\./);
        const subState = subStateDuck.reducer(state[key] as any, { ...action, type: '.' + childAction });
        return { ...state, [key]: subState }
      }
      return state;
    };

    const cache: { [key: string]: { [K in keyof M]: ReturnType<M[K]> } } = {} as any;

    const get = (key: string) => {
      const duckInCache = cache[key];
      if (duckInCache) {
        return duckInCache;
      }
      const duck = duckCreator(prefix + '.' + key, state => {
        const hydratedState = getBranch(state)[key];
        if (!hydratedState) {
          const emptyState = duck.reducer(undefined, { type: '' });
          return emptyState;
        }
        return hydratedState as { [K in keyof M]: ExtractState<ReturnType<M[K]>>; };
      });
      cache[key] = duck;
      return duck;
    };

    return { reducer, get };
  };
};