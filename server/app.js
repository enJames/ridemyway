import bodyParser from 'body-parser';
import cloudinary from 'cloudinary';
import cookieParser from 'cookie-parser';
import cors from 'express-cors';
import dotenv from 'dotenv';
import express from 'express';
import expressBusboy from 'express-busboy';
import logger from 'morgan';
import path from 'path';
import { serve, setup } from 'swagger-ui-express';

import routes from './routes/routes';
import Models from './models/Models';
import swaggerDocument from './swaggerDocument';

dotenv.config();

const app = express();
const urlencoded = bodyParser.urlencoded({ extended: true });
const json = bodyParser.json({ extended: true });
const port = parseInt(process.env.PORT, 10) || 8000;

// Configuration to uploading to cloudinary
cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
});

app.use(cors({
    allowedOrigins: [
        'http://localhost:8000', 'https://enjames.github.io'
    ]
}));
app.use(urlencoded); // parse form data
app.use(json); // parse json data
app.use(logger('combined')); // Log requests info
app.use(cookieParser()); // parse cookie in headers
expressBusboy.extend(app, {
    upload: true,
    path: path.join(__dirname, '/tmp')
});

// Create Tables
Models();

// API routes
app.use('/api/v1/', routes);
app.use('/doc', serve, setup(swaggerDocument));

// Catch all routes
app.get('*', (req, res) => {
    res.status(404).json({
        status: 'fail',
        message: 'Sorry, the page you seek does not exist'
    });
});

app.listen(port);

export default app;
