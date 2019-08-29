import { todoDuck } from 'ducks/todoDuck';
import { combineDucks, ExtractState } from 'lib/ducks';

export const root = combineDucks({
  thing: todoDuck,
  nested: combineDucks({
    thing: todoDuck,
  }),
})('', s => s);

export type RootState = ExtractState<typeof root>;
