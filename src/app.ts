import express from 'express';
import { Mongoose } from 'mongoose';
import config from 'config';
import cors from 'cors';

import error from './middleware/auth';
import connectToDB from './main/db';

import userRoutes from './routes/user/user';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);

app.use(error);

connectToDB((db: Mongoose | null, err: Error | null) => {
  if (!err) {
    const PORT = process.env.PORT || config.get('port');
    app.listen(PORT, () => {
      console.log('Connected to DB');
      console.log('Listening on port', PORT);
    });
  } else {
    console.log('Error in connecting to DB: ' + err);
  }
});
