import { Schema, model } from 'mongoose';

const TomsGroupSchema = new Schema({
  name_rus:{
    type: String,
    required: true,
  },
  name_eng:{
    type: String,
    required: true,
  },
  enabled:{
    type: Boolean,
    default:true,
  },
});

export const tomsGroupModel = model('tomsgroups', TomsGroupSchema);
// module.exports = model('tomsgroups', TomsGroupSchema);