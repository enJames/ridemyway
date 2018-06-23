import rides from '../models/rides';
import requests from '../models/requests';
import sendResponse from '../sendResponse';

const ridesController = {
    getAllRideOffers: (req, res) => sendResponse(
        res,
        200,
        `Found ${rides.length} ride offers`,
        rides
    ),
    getARideOffer: (req, res) => {
        const { rideId } = req.params;
        let theRide;

        // Search for ride
        rides.forEach((eachRide) => {
            if (eachRide.id === parseInt(rideId, 10)) {
                theRide = eachRide;
            }
        });

        // Check that ride exists
        if (!theRide) {
            return sendResponse(res, 404, 'Ride not found');
        }

        return sendResponse(res, 200, 'Ride found', theRide);
    },
    createRideOffer: (req, res) => {
        // retrieve ride offer details from request
        const {
            from, to, price, seatsShared, seatsAvailable, driver
        } = req.body;

        // validate data
        if (!from || !to || !price || !seatsShared || !seatsAvailable || !driver) {
            return sendResponse(res, 405, 'Please fill out all fields');
        }

        // details of ride offer to create
        const rideOffer = {
            id: rides.length + 1,
            from,
            to,
            price,
            seatsShared,
            seatsAvailable,
            driver
        };

        // Create ride offer
        rides.push(rideOffer);

        return sendResponse(res, 201, 'Ride offer created', rideOffer);
    },
    joinRide: (req, res) => {
        const { rideId } = req.params;
        const { userId } = req.body;

        // check for user and ride existence
        if (userId) {
            let exists;

            for (let i = 0; i < rides.length; i += 1) {
                if (rides[i].id === parseInt(rideId, 10)) {
                    exists = true;
                    break;
                }
            }
            if (!exists) {
                // If ride does not exist
                return sendResponse(res, 404, 'Ride offer does not exist');
            }
            // If ride exist
            const joinRequest = {
                rideId: parseInt(rideId, 10),
                userId: parseInt(userId, 10)
            };
            requests.push(joinRequest);
            return sendResponse(res, 201, 'Your request has been created', joinRequest);
        }
        // If user is not set
        return sendResponse(res, 401, 'User not recognised');
    }
};

export default ridesController;
