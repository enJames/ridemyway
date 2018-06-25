import express from 'express';
import ridesController from '../controllers/ridesController';
import usersController from '../controllers/usersController';

const routes = express.Router();

// Rides routes
routes.get('rides/', ridesController.getAllRideOffers);
routes.get('rides/:rideId', ridesController.getARideOffer);
routes.post('rides/', ridesController.createRideOffer);
routes.post('rides/:rideId/requests', ridesController.joinRide);

// User routes
routes.post('/auth/signup', usersController.createUser);
routes.post('/auth/login', usersController.login);

export default routes;
