import { Schema, model } from 'mongoose';

// Create Schema
const AdSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  photo_url: {
    type: Array,
    required: true,
  },
  file_url: {
    type: Array,
    required: false,
  },
  preview_url: {
    type: Array,
    required: true,
  },
  url: {
    type: String,
    required: false,
  },
  top_place: {
    type: Number,
    require: true,
    default: 0,
  },
  side_place: {
    type: Number,
    require: true,
    default: 0,
  },
  card_place: {
    type: Number,
    require: true,
    default: 0,
  },
  card_text: {
    type: String,
    required: false,
  },
  overlay: {
    type: String,
    require: true,
    default: 'Спец предложение',
  },
  enabled: {
    type: Boolean,
    default: false,
  },
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
      date: {
        type: Date,
        default: Date.now,
      },
      messages: {
        type: String,
      },
    },
  ],
});

export const Ad = model('ads', AdSchema);
// module.exports = Ad;
