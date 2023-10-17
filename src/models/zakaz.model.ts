import { Schema, model} from 'mongoose';
import { mehTypesModels } from './mechtype.model';
const castArray = (value: any) => (Array.isArray(value) ? value : [value]);
import { Counter } from './counter.model';

const ZakazSchema = new Schema({
  number: {
    type: Number,
    required: true,
    default: 0,
  },
  cities: {
    type: String,
    required: false,
  },
  title: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  kl: {
    type: Number,
    required: true,
    default: 0,
  },
  kl_text: {
    type: String,
    required: false,
    default: '',
  },
  many: {
    type: Number,
    required: false,
    default: 0,
  },
  comment:{
    type: String,
  },
  date_old: {
    type: Date,
    required: false,
  },
  photo_url: {
    type: Array,
    required: false,
  },
  index_photo: {
    type: Number,
    required: false,
    default: 0,
  },
  file_url: {
    type: Array,
    required: false,
  },
  telegram_url: {
    type: Array,
    required: false,
  },
  work_category: {
    type: [String],
    require: true,
    default: ['5f51fda156a0c50b1a44c69c'],
    // категория прочая мех обработка
  },
  work_info: [{
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  ],
  //create user
  user: {
    type: String,
    required: true,
  },
  //Последний кто редактировал заказ
  final_editing_user: {
    type: String,
    // required: true,
    required: false,
  },
  // Кому принадлежит заказ
  inhere_user: {
    type: String,
    required: true,
  },
  // Кому принадлежит заказ название
  inhere_user_name: {
    type: String,
    required: true,
  },
  zakaz_access_level: {
    type: [String],
    required: true,
    default: ['0'],
  },
  enabled: {
    type: Boolean,
    default: false,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  max_width: {
    type: String,
    default: '0',
  },
  max_d: {
    type: String,
    default: '0',
  },
  date: {
    type: Date,
    default: Date.now,
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

ZakazSchema.pre('save', async function (next: any) {
  try {
    let doc = this;
    if (doc.number > 0) return next();
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'zakaz_number' },
      { $inc: { sequence_value: 1 } },
      { new: true },
    );
    doc.number = counter?.sequence_value as number;
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//write db work_info
ZakazSchema.post('save', async function (next: any) {
  try {
    let doc = this;
    const infoArray = castArray(this.work_category);
    if (infoArray) {
      for (const key in infoArray) {
        if (Object.hasOwnProperty.call(infoArray, key)) {
          const element = infoArray[key];
          console.log('element zakaz model', element);
          const dataName = await mehTypesModels.aggregate([
            { $unwind: '$items' },
            {
              $project: {
                'items.id_name': 1,
                'items.name': 1,
                _id: 0,
              },
            },
            { $match: { 'items.id_name': element } },
          ]);
          if (!dataName) {
            return null;
          }
          const workInfo = {
            id: dataName[0].items.id_name,
            name: dataName[0].items.name,
          };

          const filter = { _id: doc._id };
          const update = { $addToSet: { work_info: workInfo } };
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          await Zakaz.findOneAndUpdate(filter, update);
        }
      }
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export const Zakaz = model('zakazes', ZakazSchema);
