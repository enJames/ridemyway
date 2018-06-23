import rides from '../models/Rides';
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
        const {
            from, to, price, seatsShared, seatsAvailable, driver
        } = req.body;

        // validate
        if (!from || !to || !price || !seatsShared || !seatsAvailable || !driver) {
            return sendResponse(res, 405, 'Please fillout all fields');
        }

        // Ride offer to create
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
