import express from 'express';
import ridesController from '../controllers/ridesController';
import usersController from '../controllers/usersController';
import Validate from '../Validate';

const routes = express.Router();

// Rides routes
routes.get('/rides', ridesController.getAllRideOffers);
routes.get('/rides/:rideId', Validate.checkParams, ridesController.getARideOffer);
routes.get('/rides/:rideId/requests', Validate.checkParams, ridesController.getRequests);
routes.post('/rides', Validate.createOffer, ridesController.createRideOffer);
routes.post('/rides/:rideId/requests', Validate.checkParams, ridesController.joinRide);

// User routes
routes.post('/auth/signup', Validate.signup, usersController.createUser);
routes.post('/auth/login', Validate.login, usersController.login);

export default routes;
