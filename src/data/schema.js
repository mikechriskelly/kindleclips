import {
  GraphQLSchema as Schema,
  GraphQLObjectType as ObjectType,
} from 'graphql';

import me from './queries/me';
import content from './queries/content';
import news from './queries/news';
import clips from './queries/clips';

const schema = new Schema({
  query: new ObjectType({
    name: 'Query',
    fields: {
      me,
      content,
      news,
      clips,
    },
  }),
});

export default schema;
