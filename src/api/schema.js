import {
  GraphQLSchema as Schema,
  GraphQLObjectType as ObjectType,
} from 'graphql';

import { readClips } from './queries/clips';

const schema = new Schema({
  query: new ObjectType({
    name: 'Query',
    fields: { readClips },
  }),
});

export default schema;
