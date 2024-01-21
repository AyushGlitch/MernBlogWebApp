import express from 'express';
import { dbConnect } from './db/dbConnect.js';
import authRoutes from './routes/auth.route.js';

dbConnect()

const app = express();
app.use(express.json())

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})

app.use('/api/auth', authRoutes)

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})