const mongoose = require('mongoose');

const childrenMechSchema = new mongoose.Schema({

  id_name:{
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  enabled:{
    type: Boolean,
    required: true,
    default: true,
  },
});

const MechTypeSchema = new mongoose.Schema({
  id_key:{
    type: String,
    required: true,
  },
  name_key:{
    type: String,
    required: true,
  },
  items:[childrenMechSchema],
});

export const mehTypesModels = mongoose.model('meh_types', MechTypeSchema);
// module.exports = mongoose.model('meh_types', MechTypeSchema);