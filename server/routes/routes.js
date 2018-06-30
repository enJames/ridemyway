import express from 'express';
import ridesController from '../controllers/ridesController';
import usersController from '../controllers/usersController';
import Validate from '../Validate';

const routes = express.Router();
const {
    createOfferData, checkParams, signupData, loginData, verify, authorizeAction,
} = Validate;

const {
    createRideOffer,
    updateRideOffer,
    acceptRejectRideRequest,
    deleteRideOffer,
    getAllJoinRequests,
    createUser,
    loginUser,
    logOutUser
} = usersController;

const {
    getAllRideOffers,
    getARideOffer,
    joinRide
} = ridesController;

// Rides routes
// Get all ride offers | no auth
routes.get('/rides', getAllRideOffers);

// Get a ride offer | no auth
routes.get('/rides/:rideId', checkParams, getARideOffer);

// Make a join ride request | auth
routes.post('/rides/:rideId/requests', verify, checkParams, joinRide);

// User routes
// Create ride offer
routes.post(
    '/users/rides',
    verify,
    createOfferData,
    createRideOffer
);

// Update ride offer | optional
routes.put(
    '/users/rides/:rideId/update',
    verify,
    checkParams,
    authorizeAction,
    updateRideOffer
);

// Delete ride offer | optional
routes.delete(
    '/users/rides/:rideId',
    verify,
    checkParams,
    authorizeAction,
    deleteRideOffer
);

// Get all join request to ride offer
routes.get(
    '/users/rides/:rideId/requests',
    verify,
    authorizeAction,
    checkParams,
    getAllJoinRequests
);

// Accept or reject ride offers
routes.put(
    '/users/rides/:rideId/requests/:requestId',
    verify,
    authorizeAction,
    checkParams,
    acceptRejectRideRequest
);


routes.post('/auth/signup', signupData, createUser);
routes.post('/auth/login', loginData, loginUser);
routes.post('/auth/logout', logOutUser);


export default routes;
