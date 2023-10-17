import { Schema, model } from 'mongoose';
import { Counter } from './counter.model';

const GroupSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  access_level: {
    type: Number,
    default: 0,
    min: 0,
  },
  raiting:{
    type: Number,
    required: true,
    default: 3,
    min: 1,
  },
  legend:{
    type: String,
    required: true,
    default: '',
  },
  enabled:{
    type: Boolean,
    default: true,
  },
});

GroupSchema.pre('save', function (next: any) {
  try {
    let doc = this;
    if (doc.access_level > 0) return next();
    Counter.findByIdAndUpdate(
      { _id: 'access_level_number' },
      { $inc: { sequence_value: 1 } },
      function (error: any, count: { sequence_value: number }) {
        if (error) return console.log(error);
        doc.access_level = count.sequence_value;
        next();
      },
    );
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export const Group = model('groups', GroupSchema);
// module.exports = Group; 
