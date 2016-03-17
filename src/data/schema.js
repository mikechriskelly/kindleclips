import {
  GraphQLSchema as Schema,
  GraphQLObjectType as ObjectType,
} from 'graphql';

import me from './queries/me';
import content from './queries/content';
import news from './queries/news';
import clippings from './queries/clippings';

const schema = new Schema({
  query: new ObjectType({
    name: 'Query',
    fields: {
      me,
      content,
      news,
      clippings,
    },
  }),
});

export default schema;
