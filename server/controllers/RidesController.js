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
    }
};

export default ridesController;
