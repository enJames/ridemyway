import express from 'express';
import ridesController from '../controllers/ridesController';
import usersController from '../controllers/usersController';

const rides = express.Router();
const users = express.Router();

// Rides routes
rides.get('/', ridesController.getAllRideOffers);
rides.get('/:rideId', ridesController.getARideOffer);
rides.post('/', ridesController.createRideOffer);
rides.post('/:rideId/requests', ridesController.joinRide);

// User routes
users.post('/signup', usersController.signup);

const routes = { rides };

export default routes;
