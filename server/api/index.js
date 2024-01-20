import express from 'express';
import { dbConnect } from './db/dbConnect.js';

dbConnect()

const app = express();

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})