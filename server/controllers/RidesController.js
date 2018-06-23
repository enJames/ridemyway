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
    },
    create: (req, res) => {
        const {
            from, to, price, seatsShared, seatsAvailable, driver
        } = req.body;

        // validate
        if (!from || !to || !price || !seatsShared || !seatsAvailable || !driver) {
            return SendResponse(res, 405, 'Please fillout all fields');
        }

        // Ride offer to create
        const rideOffer = {
            id: Rides.length + 1,
            from,
            to,
            price,
            seatsShared,
            seatsAvailable,
            driver
        };

        // Create ride offer
        Rides.push(rideOffer);

        return SendResponse(res, 201, 'Ride offer created', rideOffer);
    }
};

export default RidesController;
