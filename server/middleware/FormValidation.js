import Reusables from '../Reusables';

const { sendResponse } = Reusables;

const emailRegex = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/;
const numberRegex = /^[0-9]+$/;

const FormValidation = {
    validateSignupForm: (req, res, next) => {
        if (
            !req.body.password.trim()
            || !(req.body.password === req.body.repassword)
            || req.body.password.length < 6
        ) {
            return sendResponse(res, 400, 'fail', 'Password contain errors');
        }

        if (
            !req.body.email.trim()
            || !emailRegex.test(req.body.email)
        ) {
            return sendResponse(res, 400, 'fail', 'email is required');
        }

        if (
            !req.body.firstname.trim()
            || !req.body.lastname.trim()
            || !req.body.gender.trim()
            || !req.body.phone.trim()
            || !numberRegex.test(req.body.phone)
            || !req.body.city.trim()
            || !req.body.state.trim()
        ) {
            return sendResponse(res, 400, 'fail', 'Please fill out all fields');
        }
        return next();
    },
    ValidateLoginForm: (req, res, next) => {
        if (
            !req.body.password.trim()
            || !(req.body.password !== req.body.repassword)
            || req.body.password.length < 6
        ) {
            return sendResponse(res, 400, 'fail', 'Password is required');
        }
        if (
            !req.body.email.trim()
            || !emailRegex.test(req.body.email)
        ) {
            return sendResponse(res, 400, 'fail', 'email is required');
        }

        return next();
    },
    ValidateCreateOfferForm: (req, res, next) => {
        if (
            !req.body.fromState.trim()
            || !req.body.fromCity.trim()
            || !req.body.toState.trim()
            || !req.body.toCity.trim()
            || !req.body.price.trim()
            || !req.body.seats.trim()
            || !req.body.departureDate.trim()
            || !req.body.departureTime.trim()
        ) {
            return sendResponse(res, 400, 'fail', 'email is required');
        }

        return next();
    }
    /*
    profileUpdate: (req, res, next) => {
        if (
            !req.body.firstname.trim()
            || !req.body.lastname.trim()
            || !req.body.phone.trim()
            || !numberRegex.test(req.body.phone)
            || !req.body.city.trim()
            || !req.body.state.trim()
        ) {
            return sendResponse(res, 400, 'fail', 'Please fill out all fields');
        }
        return next();req.body.
    } */
};

export default FormValidation;
