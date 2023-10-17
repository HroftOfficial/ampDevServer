import mongoose from 'mongoose';

const userId = new mongoose.Types.ObjectId().toString();

export const userPayload = {
  _id: new mongoose.Types.ObjectId('5d95adbd02980900063cd600'),
  email: 'sagdinov.a@yandex.ru',
  name: 'Сагдинов Александр',
};

export const createUserPayload = {
  email: 'q@mail.ru',
  password:'123456',
  name: 'Jon Silver',
  position: 'manager',
  enabled: true,
};

export const loginCreateUserPayload = {
  email: 'q@mail.ru',
  password:'123456',
};

export const noLoginUserData = {
  email: '1q@mail.ru',
  password:'1234567',
};

export const requestUserCreatePayload = {
  'accessToken': expect.any(String),
  'refreshToken': expect.any(String),
  'user': {
    '_id': expect.any(String),
    'email': 'q@mail.ru',
    'name': 'Jon Silver',
  },
};
