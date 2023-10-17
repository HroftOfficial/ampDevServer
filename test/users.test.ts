import supertest from 'supertest';
import app from '../src/app';
import { sign } from 'jsonwebtoken';
import { config } from '../src/config/config';
import {
  userPayload,
  createUserPayload,
  requestUserCreatePayload,
  loginCreateUserPayload,
  noLoginUserData,
} from './utils';
// eslint-disable-next-line import/no-extraneous-dependencies
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

export let refreshTokenCookie = '';
describe('users', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe('get users route', () => {
    describe('given the users does not exist', () => {
      it('should return a 404', () => {
        expect(true).toBe(true);
      });
    });
    describe(' create user', () => {
      describe(' given the user admin is not logged in ', () => {
        it('should return a 403 ', async () => {
          const { statusCode } = await supertest(app).post(
            '/api/users/registration',
          );
          expect(statusCode).toBe(401);
        });
      });
      describe(' given the user admin is logged in ', () => {
        it('should return a 200 ', async () => {
          const jwt = sign(userPayload, config.JWT_ACCESS_SECRET);
          const { statusCode, body, headers } = await supertest(app)
            .post('/api/users/registration')
            .set('Authorization', `Bearer ${jwt}`)
            .send(createUserPayload);
          expect(statusCode).toBe(200);
          const cookies = headers['set-cookie'][0].split(',')[0].split(';')[0].split('=')[0];
          expect(body).toEqual(requestUserCreatePayload);
          expect(cookies).toEqual('refreshToken');
        });
      });
    });
    describe('login user', () => {
      describe('login not correct', () => {

        it('should return 401', async () => {
          //create
          const jwt = sign(userPayload, config.JWT_ACCESS_SECRET);
          await supertest(app)
            .post('/api/users/registration')
            .set('Authorization', `Bearer ${jwt}`)
            .send(createUserPayload);        
                  
          //login
          const { statusCode } = await supertest(app)
            .post('/api/users/login')
            .send(noLoginUserData);
          expect(statusCode).toBe(400);
        });
        it('should return 200', async () => {
          //create
          const jwt = sign(userPayload, config.JWT_ACCESS_SECRET);
          await supertest(app)
            .post('/api/users/registration')
            .set('Authorization', `Bearer ${jwt}`)
            .send(createUserPayload);
          
          
          //login
          const { statusCode, body, headers } = await supertest(app)
            .post('/api/users/login')
            .send(loginCreateUserPayload);
          expect(statusCode).toBe(200);
          expect(body).toEqual(requestUserCreatePayload);
          expect(headers['set-cookie'][0].split(';')[0]).toMatch(/refreshToken=?/);
          refreshTokenCookie = headers['set-cookie'][0].split(';')[0];
        });
      });
    });

    describe(' logout user ', () => {
      it('logout', async () => {
        const { statusCode, headers } = await supertest(app)
          .post('/api/users/logout');
        expect(statusCode).toBe(200);
        expect(headers['set-cookie'][0].split(';')).toContain('refreshToken=');
      });
    });

    describe('refresh', () => {
      it(' refresh => not refreshToken cookies', async () => {
        const { statusCode, body } = await supertest(app)
          .post('/api/users/refresh');
        expect(statusCode).toBe(401);
        expect(body).toEqual({});
      });
      // it(' refresh => add refreshToken cookies', async () => {
      //   console.log(refreshTokenCookie);
      //   //refresh
      //   const { statusCode, body, headers } = await supertest(app)
      //     .post('/api/users/refresh')
      //     .set('Cookie', ['refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGE2YmMzNGFmYWUwYjU4N2MzMjYxOGEiLCJuYW1lIjoiSm9uIFNpbHZlciIsImVtYWlsIjoicUBtYWlsLnJ1IiwiaWF0IjoxNjg4NjQ4NzU2LCJleHAiOjE2OTEyNDA3NTZ9.kX4FCEwNqoZp9IRqHbuqUiBz2IqMlp6Hpj4C3sdcKT8']);
      //   console.log('body >> ', body);
      //   console.log('header >> ', headers['set-cookie']);
      //   // expect(statusCode).toBe(200);
      //   expect(body).toEqual({});
      // });
    });

    describe('change enabled user', () => {
      
    });
  });
});
