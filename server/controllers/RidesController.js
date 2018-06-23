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

        Rides.forEach((ride) => {
            if (ride.id === parseInt(rideId, 10)) {
                theRide = ride;
            }
        });

        return SendResponse(res, 200, 'Ride found', theRide);
    }
};

export default RidesController;
