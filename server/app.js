import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import Routes from './routes/Routes';

const app = express();
const urlencoded = bodyParser.urlencoded({ extended: false });
const port = parseInt(process.env.PORT, 10) || 8000;

app.use(urlencoded); // parse form data
app.use(logger('combined')); // Log requests info

// API routes
app.use('/api/v1/rides', Routes.Rides);

// Catch all routes
app.get('*', (req, res) => {
    res.status(200).json({
        message: 'Ride my way application by Enejo James Oche.'
    });
});

app.listen(port);

export default app;
