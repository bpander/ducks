import { todoDuck } from 'ducks/todoDuck';
import { combineDucks, ExtractState } from 'lib/ducks';
import { keyedSubStates } from 'lib/keyedSubStates';

export const root = combineDucks({
  thing: todoDuck,
  nested: combineDucks({
    thing: todoDuck,
  }),
  keyedSubState: keyedSubStates({
    foo: todoDuck,
    bar: todoDuck,
  }),
})('', s => s);

export type RootState = ExtractState<typeof root>;
