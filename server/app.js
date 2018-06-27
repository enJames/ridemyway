import bodyParser from 'body-parser';
import express from 'express';
import expressValidator from 'express-validator';
import logger from 'morgan';
import routes from './routes/routes';
import connectionPool from './databaseModels/connectionPool';

const app = express();
const urlencoded = bodyParser.urlencoded({ extended: false });
const json = bodyParser.json({ extended: false });
const port = parseInt(process.env.PORT, 10) || 8000;

app.use(urlencoded); // parse form data
app.use(json); // parse json data
app.use(logger('combined')); // Log requests info
app.use(expressValidator());

// API routes
app.use('/api/v1/', routes);

// Catch all routes
app.get('/see', (req, res) => {
    connectionPool.query('SELECT * FROM "Users"', (err, result) => {
        if (err) {
            return err;
        }
        console.log(result);

        res.status(200).json({
            message: 'Ride my way application by Enejo James Oche.'
        });
    });
});

app.listen(port);

export default app;
