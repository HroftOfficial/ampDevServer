import { Schema, model } from 'mongoose';

const GroupPlantApSchema = new Schema({
  name:{
    type: String,
    required: true,
  },
  enabled:{
    type: Boolean,
    default: true,
  },
  plantGroupAp: {
    type: String,
  },
});

export const groupPlantModelAp = model('groupplantaps', GroupPlantApSchema);
// module.exports = model('groupplantaps', GroupPlantApSchema);