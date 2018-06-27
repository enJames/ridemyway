import Reusables from './Reusables';

const { sendResponse, sendErrors } = Reusables;

const Validate = {
    signup: (req, res, next) => {
        /*
        req.check('firstname')
            .notEmpty()
            .withMessage('Enter your first name');
        req.check('lastname')
            .notEmpty()
            .withMessage('Enter your last name');
        req.check('gender')
            .notEmpty()
            .withMessage('Enter your first name');
        req.check('email')
            .isEmail()
            .withMessage('Enter a valid email address')
            .notEmpty()
            .withMessage('Enter a valid email address'); */
        req.check('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long');
        req.check('repassword')
            .equals(req.body.password)
            .withMessage('Passwords do not match');
        /* req.check('phone')
            .notEmpty()
            .withMessage('Enter your phone number')
            .isLength({ min: 11, max: 11 })
            .withMessage('Phone number is incorrect');
        req.check('city')
            .notEmpty()
            .withMessage('Enter your phone number');
        req.check('state')
            .notEmpty()
            .withMessage('Enter your City'); */

        // Send errors if they exist
        return sendErrors(req.validationErrors(), res, next);
    },
    login: (req, res, next) => {
        req.check('email')
            .isEmail()
            .withMessage('Enter a valid email address')
            .notEmpty()
            .withMessage('Enter a valid email address');
        req.check('password')
            .notEmpty()
            .withMessage('Enter password');

        // Send errors if they exist
        return sendErrors(req.validationErrors(), res, next);
    },
    createOffer: (req, res, next) => {
        /*
        req.check('fromState')
            .notEmpty()
            .withMessage('Enter your current State');
        req.check('fromCity')
            .notEmpty()
            .withMessage('Enter your current City'); */
        req.check('toState')
            .notEmpty()
            .withMessage('Enter destination State');
        /* req.check('toCity')
            .notEmpty()
            .withMessage('Enter destination City');
        req.check('price')
            .notEmpty()
            .withMessage('Enter price for the ride')
            .matches(/^[0-9]+$/)
            .withMessage('Price must be a number');
        req.check('seats')
            .notEmpty()
            .withMessage('Seats cannot be empty')
            .matches(/^[0-9]+$/)
            .withMessage('Seats must be a number');
        req.check('pickupLocation')
            .notEmpty()
            .withMessage('Enter a pickup location');
        req.check('departureDate')
            .notEmpty()
            .withMessage('Enter departure date');
        req.check('departureTime')
            .notEmpty()
            .withMessage('Enter departure time'); */

        // Send errors if they exist
        return sendErrors(req.validationErrors(), res, next);
    },
    profileUpdate: (req, res, next) => {
        /*
        req.check('firstname')
            .notEmpty()
            .withMessage('Enter your first name');
        req.check('lastname')
            .notEmpty()
            .withMessage('Enter your last name');
        req.check('phone')
            .notEmpty()
            .withMessage('Enter your phone number')
            .isNumeric()
            .withMessage('Phone number can only contain numbers')
            .isLength({ min: 11, max: 11 })
            .withMessage('Phone number is incorrect');
        req.check('city')
            .notEmpty()
            .withMessage('Enter your city of residence');
        req.check('state')
            .notEmpty()
            .withMessage('Enter your state of residence');

        // Send errors if they exist
        return sendErrors(req.validationErrors(), res, next); */
    },
    checkParams: (req, res, next) => {
        const { rideId, requestId } = req.params;
        const numberRegex = /^[0-9]+$/;

        if (rideId) {
            if (!numberRegex.test(rideId)) {
                return sendResponse(res, 401, 'Invalid ride ID', { error: true });
            }
        }
        /*
        if (requestId) {
            if (!numberRegex.test(requestId)) {
                return sendResponse(res, 401, 'Invalid request ID', { error: true });
            }
        } */

        return next();
    }
};

export default Validate;
