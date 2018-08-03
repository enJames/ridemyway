import express from 'express';
import ridesController from '../controllers/ridesController';
import usersController from '../controllers/usersController';
import FormValidation from '../middlewares/FormValidation';
import Protect from '../middlewares/Protect';

const routes = express.Router();

// Middlewares
const {
    checkParams, verifyUser, authorizeAction
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
    rideOwnerProfile,
    logOutUser
} = usersController;

const {
    getAllRideOffers,
    getARideOffer,
    joinRide,
    createRideOffer,
    updateRideOffer,
    acceptRejectRideRequest,
    cancelRideOffer,
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
// Dashboard
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

// Canel ride offer | optional
routes.put(
    '/users/rides/:rideId',
    checkParams,
    verifyUser,
    authorizeAction,
    cancelRideOffer
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

// Send user's own profile
routes.get('/users/profile', verifyUser, sendUserProfile);

// Send ride creator's profile to other users
routes.get('/users/:rideOwnerId', checkParams, verifyUser, rideOwnerProfile);

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

routes.post('/auth/signup', validateSignupForm, createUser);
routes.post('/auth/login', validateLoginForm, loginUser);
routes.post('/auth/logout', logOutUser);


export default routes;
