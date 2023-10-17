import { Schema, model } from 'mongoose';
const { Counter } = require('./counter.model');

const PlantApSchema = new Schema({
  number: {
    type: Number,
    require: true,
    default: 0,
  },
  name: {
    type: String,
    required: true,
    trim:true,
  },
  sortNumber: {
    type: Number,
    required: false,
    default:10,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  deleted: {   
    type: Boolean,
    default: false,
  },
  photo_plant: {
    type: Array,
    required: false,
  },
  index_photo: {
    type: Number,
    required: false,
    default: 0,
  },
  file_plant: {
    type: Array,
    required: false,
  },
  plantGroup: {
    type: String,
  },
  newPlant: {
    type: Boolean,
    default: false,
  },
  info: {
    type: String,
    required: false,
    trim:true,
  },
  // Кому принадлежит
  inhereUser:{
    inhereUserId:{
      type: Schema.Types.ObjectId,
      ref: 'usersamps',
    },
    inhereUserName:{
      type: String,
      required: true,
    },
  },
  cities: { type: String, trim: true },
  price: { type: String, trim: true },
  history: [
    {
      id: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      messages: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});


PlantApSchema.pre('save', async function (next: any) {
  try {
    let doc = this;
    if (doc.number > 0) return next();
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'plant_number' },
      { $inc: { sequence_value: 1 } },
      { new: true },
    );
    doc.number = counter?.sequence_value as number;
  } catch (error) {
    console.log(error);
    next(error);
  }
});


export const PlantAp = model('plantAps', PlantApSchema);
