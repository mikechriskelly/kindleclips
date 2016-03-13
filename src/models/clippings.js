// WORK IN PROGRESS

import mongoose from 'mongoose';

// Define a schema for Clippings
const schema = new mongoose.Schema({
  id: String,
  text: String,
  title: String,
  author: String,
});

// Create a static method to return clippings from DB
schema.statics.getClippings = (callback) => {
  // Query the db, using skip and limit to achieve page chunks
  Clippings.find({}).exec((err, res) => {
    res.json(topics);
  });
};


// Compiles the schema into a model, opening (or creating, nonexistent) 
// the 'Clipping' collection in the MongoDB database
export const Clippings = mongoose.model('Clippings', schema);

exports.all = function(req, res) {
  Clippings.find({}).exec(function(err, topics) {
    if(!err) {
      res.json(topics);
    }else {
      console.log('Error in first query');
    }
  });
};

