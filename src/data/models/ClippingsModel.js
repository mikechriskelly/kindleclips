import mongoose from 'mongoose';

// Define a schema for Clippings
const clippingsSchema = new mongoose.Schema({
  id: String,
  text: String,
  title: String,
  author: String,
});

// Compiles the schema into a model, opening (or creating, nonexistent)
// the 'Clipping' collection in the MongoDB database
export default mongoose.model('Clippings', clippingsSchema);
