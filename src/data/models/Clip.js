import mongoose from 'mongoose';

// Define a schema for Clippings
const clipSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: false },
  author: { type: String, required: false },
  text: { type: String, required: true },
  search: { type: String, required: false },
  clipowner: { type: Number, required: true },
});

clipSchema.index({ text: 'text', title: 'text', author: 'text' });

// Compiles the schema into a model, opening (or creating, nonexistent)
// the 'Clipping' collection in the MongoDB database
export default mongoose.model('Clip', clipSchema);