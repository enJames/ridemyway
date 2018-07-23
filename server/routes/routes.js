import express from 'express';
import ridesController from '../controllers/ridesController';
import usersController from '../controllers/usersController';
import FormValidation from '../middlewares/FormValidation';
import Protect from '../middlewares/Protect';

const routes = express.Router();

// Middlewares
const {
    checkParams, verifyUser, authorizeAction, checkUserIsLoggedIn
} = Protect;

const {
    validateSignupForm,
    validateLoginForm,
    validateCreateOfferForm,
    validateEditProfileForm
} = FormValidation;

const {
    createUser,
    loginUser,
    dashboard,
    sendUserProfile,
    editUserProfile,
    uploadImage,
    logOutUser
} = usersController;

const {
    getAllRideOffers,
    getARideOffer,
    joinRide,
    createRideOffer,
    updateRideOffer,
    acceptRejectRideRequest,
    deleteRideOffer,
    getAllJoinRequests
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
routes.get(
    '/users/dashboard',
    verifyUser,
    dashboard
);
// Create ride offer
routes.post(
    '/users/rides',
    verifyUser,
    validateCreateOfferForm,
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

// Send user's profile
routes.get('/users/profile', verifyUser, sendUserProfile);

// Edit user's profile
routes.put(
    '/users/profile/edit',
    verifyUser,
    validateEditProfileForm,
    editUserProfile
);

// Image upload
routes.put(
    '/users/profile/upload',
    verifyUser,
    uploadImage
);

routes.get('/auth/check', checkUserIsLoggedIn);

routes.post('/auth/signup', validateSignupForm, createUser);
routes.post('/auth/login', validateLoginForm, loginUser);
routes.post('/auth/logout', logOutUser);


export default routes;
