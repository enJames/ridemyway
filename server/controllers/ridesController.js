import rides from '../models/rides';
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
    }
};

export default ridesController;
