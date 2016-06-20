import mongoose from 'mongoose';

// Define a schema for Clippings
const clipSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: false },
  author: { type: String, required: false },
  text: { type: String, required: true },
  search: { type: String, required: false },
  clipowner: { type: String, required: true },
});

clipSchema.index(
  {
    text: 'text',
    title: 'text',
    author: 'text',
    id: 'text',
    clipowner: 'text',
  },
  { unique: true }
);

// Compiles the schema into a model, opening (or creating, if nonexistent)
// the 'clips' collection in the MongoDB database
export default mongoose.model('Clip', clipSchema);
