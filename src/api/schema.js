import {
  GraphQLSchema as Schema,
  GraphQLObjectType as ObjectType,
} from 'graphql';

import content from './queries/content';
import clips from './queries/clips';

const schema = new Schema({
  query: new ObjectType({
    name: 'Query',
    fields: {
      content,
      clips,
    },
  }),
});

export default schema;
