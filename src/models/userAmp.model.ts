import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  org: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  cities: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: true,
  },
  favorite: {
    type: Array,
    required: false,
  },
  favoritePlant: {
    type: Array,
    required: false,
  },
  tag: {
    type: Array,
    required: false,
  },
  tag_count: {
    type: Number,
    required: true,
    default: 5,
  },
  region: {
    type: String,
    required: false,
    default: '',
  },
  work_category: {
    type: Array,
    required: true,
    default: ['5f51fda156a0c50b1a44c69c'],
  },
  work_info: {
    type: Array,
    require: false,
  },
  inn: {
    type: Number,
  },
  ogrn: {
    type: Number,
  },
  information: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  changePasswordHashed:{
    type: String,
  },
  person_data: {
    type: Boolean,
    require: true,
    default: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  user_access_level: {
    type: Array,
    required: true,
    default: ['0'],
  },
  write_access_level: {
    type: Array,
    required: true,
    default: ['0'],
  },
  enabled: {
    type: Boolean,
    require: true,
    default: false,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  service: {
    type: Boolean,
    default: false,
  },
  logo__img: {
    type: Array,
    require: false,
  },
  raiting: {
    type: Number,
    required: true,
    default: 3,
    min: 1,
  },
  legend: {
    type: String,
    required: true,
    default: 'не определено',
  },
  html__href: {
    type: String,
    default: '#',
  },
  extended_sorting:{
    type: Number,
    default: 10000,
  },
  lastVisit:{
    type: Date,
    required: false,
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

// module.exports = model('usersamps', UserSchema);
const userModelAmp = model('usersamps', UserSchema);
export { userModelAmp };
// module.exports = userModelAmp;
