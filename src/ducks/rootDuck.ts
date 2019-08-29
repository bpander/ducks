import { combineDucks, ExtractState } from 'lib/ducks';
import { todoDuck } from 'ducks/todoDuck';

export const root = combineDucks({
  thing: todoDuck(),
  nested: combineDucks({
    thing: todoDuck('SOME_ACTION_PREFIX'),
  }),
})(s => s);

export type RootState = ExtractState<typeof root>;
