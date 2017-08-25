import Clip from '../models/Clip';
import {
  GraphQLObjectType as ObjectType,
  GraphQLID as ID,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  GraphQLList as ListType,
} from 'graphql';

const ClipType = new ObjectType({
  name: 'Clip',
  fields: () => ({
    id: { type: new NonNull(ID) },
    userId: { type: new NonNull(ID) },
    hash: { type: new NonNull(ID) },
    title: { type: StringType },
    author: { type: StringType },
    text: { type: new NonNull(StringType) },
    slug: { type: StringType },
    similarClips: {
      type: new ListType(ClipType),
      resolve: (clip) => Clip.getSimilar(clip.id), // .then(post => post.toJSON().comments);
    },
  }),
});

export default ClipType;
