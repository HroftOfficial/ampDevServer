import app from './app';
// eslint-disable-next-line import/no-extraneous-dependencies
import mongoose, { ConnectOptions } from 'mongoose';
import { config } from './config/config';

// const PORT = process.env.PORT || 6500;
const { PORT, MONGODB_URL } = config;

const start = async () => {
  try {
    // mongo
    await mongoose
      .connect(MONGODB_URL!, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      } as ConnectOptions)
      .then(() => console.log('MongoDb Connected'))
      .catch((err) => console.warn(err));

    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to db');
    });

    mongoose.connection.on('error', (err) => {
      console.warn(err.message.red);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose connection is disconnected');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      process.exit(0);
    });
    // end mongo
    app.listen(PORT!, () => {
      console.log(`Server 🚀  started on port ${PORT} 🙂`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
