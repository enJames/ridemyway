import Reusables from '../Reusables';

const { sendResponse } = Reusables;

const emailRegex = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/;
const numberRegex = /^[0-9]+$/;
const dateRegex = /^[2-9][0-9]{3}[-][0-1][0-9][-][0-3][0-9]$/;

const FormValidation = {
    validateSignupForm: (req, res, next) => {
        if (!req.body.firstname || !req.body.firstname.trim()) {
            return sendResponse(res, 400, 'fail', 'Firstname is required');
        }
        if (!req.body.email || !req.body.email.trim()) {
            return sendResponse(res, 400, 'fail', 'Email is required');
        }
        if (!emailRegex.test(req.body.email)) {
            return sendResponse(res, 400, 'fail', 'Invalid email address');
        }
        if (!req.body.password || !req.body.password.trim()) {
            return sendResponse(res, 400, 'fail', 'Password is required');
        }
        if (req.body.password !== req.body.confirmPassword) {
            return sendResponse(res, 400, 'fail', 'Passwords do not match');
        }

        return next();
    },
    validateLoginForm: (req, res, next) => {
        if (!req.body.email || !req.body.email.trim()) {
            return sendResponse(res, 400, 'fail', 'Email is required');
        }
        if (!emailRegex.test(req.body.email)) {
            return sendResponse(res, 400, 'fail', 'Invalid email address');
        }
        if (!req.body.password || !req.body.password.trim()) {
            return sendResponse(res, 400, 'fail', 'Password is required');
        }

        return next();
    },
    validateCreateOfferForm: (req, res, next) => {
        if (!req.body.fromState || !req.body.fromState.trim()) {
            return sendResponse(res, 400, 'fail', 'Current state is required');
        }
        if (!req.body.fromCity || !req.body.fromCity.trim()) {
            return sendResponse(res, 400, 'fail', 'Current city is required');
        }
        if (!req.body.toState || !req.body.toState.trim()) {
            return sendResponse(res, 400, 'fail', 'Destination state is required');
        }
        if (!req.body.toCity || !req.body.toCity.trim()) {
            return sendResponse(res, 400, 'fail', 'Destination city is required');
        }
        if (!req.body.price || !req.body.price.trim() || !numberRegex.test(req.body.price)) {
            return sendResponse(res, 400, 'fail', 'Enter a valid value for price');
        }
        if (!req.body.seats || !req.body.seats.trim() || !numberRegex.test(req.body.seats)) {
            return sendResponse(res, 400, 'fail', 'Enter a valid value for seats');
        }
        if (!req.body.departureDate || !req.body.departureDate.trim()) {
            return sendResponse(res, 400, 'fail', 'Departure date is required');
        }
        if (!dateRegex.test(req.body.departureDate)) {
            return sendResponse(res, 400, 'fail', 'Departure date is invalid. Format must be YYYY-MM-DD');
        }
        if (!req.body.departureTime || !req.body.departureTime.trim()) {
            return sendResponse(res, 400, 'fail', 'Departure time is required');
        }
        if (!req.body.pickupLocation || !req.body.pickupLocation.trim()) {
            return sendResponse(res, 400, 'fail', 'Pickup location is required');
        }

        return next();
    },
    validateEditProfileForm: (req, res, next) => {
        if (!req.body.firstname || !req.body.firstname.trim()) {
            return sendResponse(res, 400, 'fail', 'Firstname is required');
        }
        if (!req.body.lastname || !req.body.lastname.trim()) {
            return sendResponse(res, 400, 'fail', 'Lastname is required');
        }
        if (!req.body.email || !req.body.email.trim()) {
            return sendResponse(res, 400, 'fail', 'Email is required');
        }
        if (!emailRegex.test(req.body.email)) {
            return sendResponse(res, 400, 'fail', 'Invalid email address');
        }
        if (!req.body.gender || !req.body.gender.trim()) {
            return sendResponse(res, 400, 'fail', 'Gender is required');
        }
        if (!req.body.phone || !req.body.phone.trim()) {
            return sendResponse(res, 400, 'fail', 'Phone number is required');
        }
        if (!numberRegex.test(req.body.phone)) {
            return sendResponse(res, 400, 'fail', 'Phone number number must contain only numbers');
        }
        if (!req.body.city || !req.body.city.trim()) {
            return sendResponse(res, 400, 'fail', 'City is required');
        }
        if (!req.body.state || !req.body.state.trim()) {
            return sendResponse(res, 400, 'fail', 'State is required');
        }
        return next();
    }
};

export default FormValidation;
