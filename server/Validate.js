import jwt from 'jsonwebtoken';
import Reusables from './Reusables';
import connectionPool from './models/connectionPool';

const { sendResponse, sendErrors } = Reusables;

const Validate = {
    signupData: (req, res, next) => {
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
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long');
        req.check('repassword')
            .equals(req.body.password)
            .withMessage('Passwords do not match');
        req.check('phone')
            .notEmpty()
            .withMessage('Enter your phone number')
            .isLength({ min: 11, max: 11 })
            .withMessage('Phone number is incorrect');
        req.check('city')
            .notEmpty()
            .withMessage('Enter your phone number');
        req.check('state')
            .notEmpty()
            .withMessage('Enter your City');

        // Send errors if they exist
        return sendErrors(res, req.validationErrors(), 'fail', next);
    },
    loginData: (req, res, next) => {
        req.check('email')
            .isEmail()
            .withMessage('Enter a valid email address')
            .notEmpty()
            .withMessage('Enter a valid email address');
        req.check('password')
            .notEmpty()
            .withMessage('Enter password');

        // Send errors if they exist
        return sendErrors(res, req.validationErrors(), 'fail', next);
    },
    createOfferData: (req, res, next) => {
        req.check('fromState')
            .notEmpty()
            .withMessage('Enter your current State');
        req.check('fromCity')
            .notEmpty()
            .withMessage('Enter your current City');
        req.check('toState')
            .notEmpty()
            .withMessage('Enter destination State');
        req.check('toCity')
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
            .withMessage('Enter departure time');

        // Send errors if they exist
        return sendErrors(res, req.validationErrors(), 'fail', next);
    },
    /*
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
        return sendErrors(req.validationErrors(), res, next);
    }, */
    checkParams: (req, res, next) => {
        const { rideId, requestId } = req.params;
        const numberRegex = /^[0-9]+$/;

        // check rideId
        if (rideId) {
            if (!numberRegex.test(rideId)) {
                return sendResponse(res, 400, 'fail', null);
            }
        }

        // check requestId
        if (requestId) {
            if (!numberRegex.test(requestId)) {
                return sendResponse(res, 400, 'fail', null);
            }
        }
        return next();
    },
    verify: (req, res, next) => {
        try {
            req.authData = jwt.verify(req.cookies.token, process.env.secret);
            return next();
        } catch (error) {
            return sendResponse(res, 401, 'fail', 'Not authenticated');
        }
    },
    authorizeAction: (req, res, next) => {
        const { rideId } = req.params;
        const { userId } = req.authData;

        // Check if logged in user created the ride
        connectionPool.query(
            `SELECT "userId" FROM "RideOffers"
            WHERE "id" = '${rideId}'`
        )
            .then((rideData) => {
                // Check that ride exists
                if (!rideData.rows[0]) {
                    return sendResponse(res, 404, 'fail', 'resource non-existent');
                }

                // Check that logged in user created the ride
                if (!(rideData.rows[0].userId === userId)) {
                    return sendResponse(res, 405, 'fail', 'Not authorized');
                }

                // Grant access to user
                next();
            })
            .catch(error => sendResponse(res, 500, 'error', error));
    }
};

export default Validate;
