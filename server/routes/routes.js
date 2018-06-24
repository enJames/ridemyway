import express from 'express';
import ridesController from '../controllers/ridesController';
import usersController from '../controllers/usersController';

const ridesRoute = express.Router();
const usersRoute = express.Router();

// Rides routes
ridesRoute.get('/', ridesController.getAllRideOffers);
ridesRoute.get('/:rideId', ridesController.getARideOffer);
ridesRoute.get('/:rideId/requests', ridesController.getRequests);
ridesRoute.post('/', ridesController.createRideOffer);
ridesRoute.post('/:rideId/requests', ridesController.joinRide);

// User routes
usersRoute.post('/signup', usersController.createUser);
usersRoute.post('/login', usersController.login);

const routes = { ridesRoute, usersRoute };

export default routes;
