import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import logger from 'morgan';
import routes from './routes/routes';
import Models from './models/Models';

const app = express();
const urlencoded = bodyParser.urlencoded({ extended: false });
const json = bodyParser.json({ extended: false });
const port = parseInt(process.env.PORT, 10) || 8000;

app.use(urlencoded); // parse form data
app.use(json); // parse json data
app.use(logger('combined')); // Log requests info
app.use(cookieParser());

// Create Tables
Models();

// API routes
app.use('/api/v1/', routes);

// Catch all routes
app.get('*', (req, res) => {
    res.status(404).json({
        status: 'fail',
        message: 'Sorry, this page does not exist'
    });
});

app.listen(port);

export default app;
