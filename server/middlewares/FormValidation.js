import Reusables from '../Reusables';

const { sendResponse } = Reusables;

const emailRegex = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/;
const numberRegex = /^[0-9]+$/;

const FormValidation = {
    validateSignupForm: (req, res, next) => {
        if (!req.body.password || !req.body.password.trim()) {
            return sendResponse(res, 400, 'fail', 'password is required');
        }
        if (req.body.password !== req.body.confirmPassword) {
            return sendResponse(res, 400, 'fail', 'passwords do not match');
        }
        if (!req.body.email || !req.body.email.trim()) {
            return sendResponse(res, 400, 'fail', 'email is required');
        }
        if (!emailRegex.test(req.body.email)) {
            return sendResponse(res, 400, 'fail', 'invalid email address');
        }
        if (!req.body.firstname || !req.body.firstname.trim()) {
            return sendResponse(res, 400, 'fail', 'firstname is required');
        }

        return next();
    },
    ValidateLoginForm: (req, res, next) => {
        if (!req.body.password || !req.body.password.trim()) {
            return sendResponse(res, 400, 'fail', 'password is required');
        }
        if (!req.body.email || !req.body.email.trim()) {
            return sendResponse(res, 400, 'fail', 'email is required');
        }
        if (!emailRegex.test(req.body.email)) {
            return sendResponse(res, 400, 'fail', 'invalid email address');
        }

        return next();
    },
    ValidateCreateOfferForm: (req, res, next) => {
        if (!req.body.fromState || !req.body.fromState.trim()) {
            return sendResponse(res, 400, 'fail', 'current state is required');
        }
        if (!req.body.fromCity || !req.body.fromCity.trim()) {
            return sendResponse(res, 400, 'fail', 'current city is required');
        }
        if (!req.body.toState || !req.body.toState.trim()) {
            return sendResponse(res, 400, 'fail', 'destination state is required');
        }
        if (!req.body.toCity || !req.body.toCity.trim()) {
            return sendResponse(res, 400, 'fail', 'destination city is required');
        }
        if (!req.body.price || !req.body.price.trim() || !numberRegex.test(req.body.price)) {
            return sendResponse(res, 400, 'fail', 'enter a valid value for price');
        }
        if (!req.body.seats || !req.body.seats.trim() || !numberRegex.test(req.body.seats)) {
            return sendResponse(res, 400, 'fail', 'enter a valid value for seats');
        }
        if (!req.body.departureDate || !req.body.departureDate.trim()) {
            return sendResponse(res, 400, 'fail', 'departure date is required');
        }
        if (!req.body.departureTime || !req.body.departureTime.trim()) {
            return sendResponse(res, 400, 'fail', 'departure time is required');
        }

        return next();
    }
    /*
    profileUpdate: (req, res, next) => {
        if (!req.body.password || !req.body.password.trim()) {
            return sendResponse(res, 400, 'fail', 'password is required');
        }

        if (!req.body.email || !req.body.email.trim()) {
            return sendResponse(res, 400, 'fail', 'email is required');
        }

        if (!emailRegex.test(req.body.email)) {
            return sendResponse(res, 400, 'fail', 'invalid email address');
        }

        if (!req.body.firstname || !req.body.firstname.trim()) {
            return sendResponse(res, 400, 'fail', 'firstname is required');
        }
        if (!req.body.lastname || !req.body.lastname.trim()) {
            return sendResponse(res, 400, 'fail', 'lastname is required');
        }
        if (!req.body.gender || !req.body.gender.trim()) {
            return sendResponse(res, 400, 'fail', 'gender is required');
        }
        if (!req.body.phone || !req.body.phone.trim()) {
            return sendResponse(res, 400, 'fail', 'phone number is required');
        }
        if (!numberRegex.test(req.body.phone)) {
            return sendResponse(res, 400, 'fail', 'phone number number must contain only numbers');
        }
        if (!req.body.city || !req.body.city.trim()) {
            return sendResponse(res, 400, 'fail', 'city is required');
        }
        if (!req.body.state || !req.body.state.trim()) {
            return sendResponse(res, 400, 'fail', 'state is required');
        }
        return next();req.body.
    } */
};

export default FormValidation;
