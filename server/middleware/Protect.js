import jwt from 'jsonwebtoken';
import Reusables from '../Reusables';
import connectionPool from '../models/connectionPool';

const { sendResponse } = Reusables;

const Protect = {
    checkParams: (req, res, next) => {
        const { rideId, requestId } = req.params;
        const numberRegex = /^[0-9]+$/;

        // check rideId
        if (rideId) {
            if (!numberRegex.test(rideId)) {
                return sendResponse(res, 400, 'fail', 'ride id not recognised');
            }
        }

        // check requestId
        if (requestId) {
            if (!numberRegex.test(requestId)) {
                return sendResponse(res, 400, 'fail', 'request id not recognised');
            }
        }

        return next();
    },
    verifyUser: (req, res, next) => {
        try {
            if (req.headers.cookies) {
                const token = req.headers.cookies.split('=')[1].split(';')[0];
                req.authData = jwt.verify(token, process.env.secret);
                return next();
            }
            req.authData = jwt.verify(req.cookies.token, process.env.secret);
            return next();
        } catch (error) {
            return sendResponse(res, 401, 'fail', 'Not authenticated', error);
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
                    return sendResponse(res, 404, 'fail', 'ride offer does not exist');
                }

                // Check that logged in user created the ride
                if (!(rideData.rows[0].userId === userId)) {
                    return sendResponse(res, 405, 'fail', 'Not authorized');
                }

                // Grant access to user
                next();
            })
            .catch(error => sendResponse(res, 500, 'error', 'connection error', error));
    }
};

export default Protect;
