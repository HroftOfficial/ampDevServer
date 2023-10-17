import { Schema, model } from 'mongoose';

const TypeSchema = new Schema({
  _id:{
    type: String,
    required: true,

  },
  sequence_value: {
    type: Number,
    required: true,
    default: 0,
  },
});
export const Counter = model('counters', TypeSchema);
// module.exports = model('counters', TypeSchema);
