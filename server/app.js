import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import logger from 'morgan';
import { serve, setup } from 'swagger-ui-express';

import routes from './routes/routes';
import Models from './models/Models';
import swaggerDocument from './swaggerDocument';

const app = express();
const urlencoded = bodyParser.urlencoded({ extended: false });
const json = bodyParser.json({ extended: false });
const port = parseInt(process.env.PORT, 10) || 8000;

app.use((req, res, next) => {
    const allowedOrigins = ['http://localhost:8000', 'https://enjames.github.io'];
    const { origin } = req.headers;

    if (allowedOrigins.indexOf(origin) > -1) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);

    return next();
});

app.use(cors()); // allow CORS requests
app.options('/api/v1/auth/signup', cors()); // enable pre-flight requests
app.options('/api/v1/users/rides/:rideId', cors()); // enable pre-flight requests
app.options('/api/v1/users/rides/:rideId/update', cors()); // enable pre-flight requests
app.options('/api/v1/users/rides/:rideId/requests/:requestId', cors()); // enable pre-flight requests
app.use(urlencoded); // parse form data
app.use(json); // parse json data
app.use(logger('combined')); // Log requests info
app.use(cookieParser()); // parse cookie in headers

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
