import Reusables from './Reusables';

const Validate = {
    signup: (req, res, next) => {
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
            .withMessage('Enter a valid email address');
        req.check('password')
            .isLength({ min: 5 })
            .withMessage('Password must be at least 5 characters long');
        req.check('repassword')
            .equals(req.body.password)
            .withMessage('Passwords do not match');
        req.check('phone')
            .notEmpty()
            .withMessage('Enter your phone number')
            .isLength()
            .withMessage('Phone number is incorrect');
        req.check('city')
            .notEmpty()
            .withMessage('Enter your phone number');
        req.check('state')
            .notEmpty()
            .withMessage('Enter your City');

        // Send errors if they exist
        return Reusables.sendErrors(req.validationErrors(), res, next);
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
        return Reusables.sendErrors(req.validationErrors(), res, next);
    },
    createOffer: (req, res, next) => {
        req.check('from-state')
            .notEmpty()
            .withMessage('Enter your current State');
        req.check('from-city')
            .notEmpty()
            .withMessage('Enter your current City');
        req.check('to-state')
            .notEmpty()
            .withMessage('Enter destination State');
        req.check('to-city')
            .notEmpty()
            .withMessage('Enter destination City');
        req.check('price')
            .notEmpty()
            .withMessage('Enter price for the ride')
            .isNumber()
            .withMessage('Price must be numeric');
        req.check('pickup-location')
            .notEmpty()
            .withMessage('Enter a pickup location');
        req.check('departure-date')
            .notEmpty()
            .withMessage('Enter departure date');
        req.check('departure-time')
            .notEmpty()
            .withMessage('Enter departure time');

        // Send errors if they exist
        return Reusables.sendErrors(req.validationErrors(), res, next);
    },
    profileUpdate: (req, res, next) => {
        req.check('firstname')
            .notEmpty()
            .withMessage('Enter your first name');
        req.check('lastname')
            .notEmpty()
            .withMessage('Enter your last name');
        req.check('phone')
            .notEmpty()
            .withMessage('Enter your phone number')
            .isLength()
            .withMessage('Phone number is incorrect');
        req.check('city')
            .notEmpty()
            .withMessage('Enter your phone number');
        req.check('state')
            .notEmpty()
            .withMessage('Enter your City');

        // Send errors if they exist
        return Reusables.sendErrors(req.validationErrors(), res, next);
    },
    checkParams: (req, res, next) => {
        const { userId, rideId, requestId } = req.params;
        const numberRegex = /^[0-9]+$/;

        if (userId) {
            if (!numberRegex.test(userId)) {
                return Reusables.sendResponse(res, 401, 'Invalid user ID', { error: true });
            }
        }
        if (rideId) {
            if (!numberRegex.test(rideId)) {
                return Reusables.sendResponse(res, 401, 'Invalid ride ID', { error: true });
            }
        }
        if (requestId) {
            if (!numberRegex.test(requestId)) {
                return Reusables.sendResponse(res, 401, 'Invalid request ID', { error: true });
            }
        }

        return next();
    }
};

export default Validate;
