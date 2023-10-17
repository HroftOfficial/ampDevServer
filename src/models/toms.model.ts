import { Schema, model } from 'mongoose';

const TomsSchema = new Schema({
  tomsgroup_key:{
    type: Schema.Types.ObjectId, 
    ref:'tomsgroups',
  },
  name:{
    type: String,
    required: true,
  },
  enabled:{
    type: Boolean,
    default: true,
  },
  id_name:{
    type: String,
    required: true,
  },
});
export const tomsModel = model('toms', TomsSchema);
// module.exports = model('toms', TomsSchema);
