import { Schema, model } from 'mongoose';

const NewsSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  //img
  news_url: {
    type: Array,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default:true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  history:[{
    id:{
      type:String,
      required:true,
    },
    name:{
      type:String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    messages:{
      type: String,
    },
  }],   
});

module.exports = model('news', NewsSchema);
