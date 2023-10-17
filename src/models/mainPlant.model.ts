import { Schema, model } from 'mongoose';

const MainPlantApSchema = new Schema({
  name:{
    type: String,
    required: true,
  },
  sortNumber:{
    type: Number,
    required: true,
  },
  enabled:{
    type: Boolean,
    default: true,
  },
  images: {
    type: Array,
    required: true,
  },
});
export const mainPlantApModel = model('mainplantaps', MainPlantApSchema);
// module.exports = model('mainplantaps', MainPlantApSchema);