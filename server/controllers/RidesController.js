import Rides from '../models/Rides';
import SendResponse from '../SendResponse';

const RidesController = {
    getAllRideOffers: (req, res) => SendResponse(
        res,
        200,
        `Found ${Rides.length} ride offers`,
        Rides
    ),
    getARideOffer: (req, res) => {
        const { rideId } = req.params;
        let theRide;

        // Search for ride
        Rides.forEach((ride) => {
            if (ride.id === parseInt(rideId, 10)) {
                theRide = ride;
            }
        });

        // Check that ride exists
        if (!theRide) {
            return SendResponse(res, 404, 'Ride not found');
        }

        return SendResponse(res, 200, 'Ride found', theRide);
    }
};

export default RidesController;
