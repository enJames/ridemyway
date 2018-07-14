import express from 'express';
import Reusables from '../Reusables';
import ridesController from '../controllers/ridesController';
import usersController from '../controllers/usersController';
import FormValidation from '../middlewares/FormValidation';
import Protect from '../middlewares/Protect';

const routes = express.Router();

// Middlewares
const {
    checkParams, verifyUser, authorizeAction, checkUserIsLoggedIn
} = Protect;

const { sendResponse } = Reusables;

const {
    validateSignupForm, ValidateLoginForm, ValidateCreateOfferForm
} = FormValidation;

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
routes.post('/rides/:rideId/requests', checkParams, verifyUser, joinRide);

// User routes
// Create ride offer
routes.post(
    '/users/rides',
    verifyUser,
    ValidateCreateOfferForm,
    createRideOffer
);

// Update ride offer | optional
routes.put(
    '/users/rides/:rideId/update',
    checkParams,
    verifyUser,
    authorizeAction,
    updateRideOffer
);

// Delete ride offer | optional
routes.delete(
    '/users/rides/:rideId',
    checkParams,
    verifyUser,
    authorizeAction,
    deleteRideOffer
);

// Get all join request to ride offer
routes.get(
    '/users/rides/:rideId/requests',
    checkParams,
    verifyUser,
    authorizeAction,
    getAllJoinRequests
);

// Accept or reject ride offers
routes.put(
    '/users/rides/:rideId/requests/:requestId',
    checkParams,
    verifyUser,
    authorizeAction,
    acceptRejectRideRequest
);

routes.get(
    '/auth/check',
    checkUserIsLoggedIn,
    (req, res) => sendResponse(res, 200, 'success', 'allow signup')
);

routes.post('/auth/signup', checkUserIsLoggedIn, validateSignupForm, createUser);
routes.post('/auth/login', checkUserIsLoggedIn, ValidateLoginForm, loginUser);
routes.post('/auth/logout', logOutUser);


export default routes;
