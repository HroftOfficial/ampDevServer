// import { Request } from 'express';
interface History {
  id:string,
  name: string,
  date?: Date,
  messages: string,

}

type ExtUserType = {
  name: string,
  _id: string,
  org?: string,
};

interface ExtUser extends Request {
  user: ExtUserType
}

type IWorkInfo = {
  id: string,
  name: string
};

type MulterFileTypes = {
  fieldname: string,
  originalname: string,
  encoding: string,
  mimetype: string,
  destination: string,
  filename: string,
  path: string,
  size: number
};

// interface IZakaz {
//   number: number,
//   cities: string,
//   title: string,
//   details: string,
//   kl: number,
//   kl_text: string,
//   many: number,
//   date_old: Date,
//   photo_url: Express.Multer.File[],
//   index_photo: number,
//   file_url: MulterFileTypes[],
//   telegram_url: MulterFileTypes[],
//   work_category: string[],
//   work_info: WorkInfo[],
//   user: string,
//   final_editing_user: string,
//   inhere_user: string,
//   inhere_user_name: string,
//   zakaz_access_level: string[],
//   enabled: boolean,
//   deleted: boolean,
//   max_width: string,
//   max_d: string,
//   date: Date,
//   history:History[],
// }
interface IZakaz {
  number: number,
  cities: string,
  title: string,
  details: string,
  kl: number,
  kl_text: string,
  many: number,
  date_old: Date,
  // photo_url: Express.Multer.File[],
  photo_url: [],
  index_photo: number,
  // file_url: Express.Multer.File[],
  file_url: [],
  // telegram_url: Express.Multer.File[],
  telegram_url: [],
  work_category: string[],
  work_info: WorkInfo[],
  user: string,
  final_editing_user: string,
  inhere_user: string,
  inhere_user_name: string,
  zakaz_access_level: string[],
  enabled: boolean,
  deleted: boolean,
  max_width: string,
  max_d: string,
  date: Date,
  history:History[],
}

export { History, ExtUser, IZakaz, IWorkInfo, MulterFileTypes, ExtUser };