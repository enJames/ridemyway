import Reusables from '../Reusables';

const { sendResponse } = Reusables;

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
    getRequests: (req, res) => {
        const { rideId } = req.params;
        const allRequests = [];
        let theRide;
        /*
        Authenticate user
        */

        // check ride exists
        for (let i = 0; i < rides.length; i += 1) {
            if (rides[i].id === parseInt(rideId, 10)) {
                theRide = rides[i];
                break;
            }
        }
        if (!theRide) {
            return sendResponse(res, 404, 'Ride offer does not exist');
        }

        // Get join ride requests
        requests.forEach((eachRequest) => {
            if (eachRequest.rideId === theRide.id) {
                allRequests.push(eachRequest);
            }
        });
        if (allRequests.length === 0) {
            return sendResponse(res, 404, 'No join requests for this ride yet');
        }
        return sendResponse(
            res,
            200,
            `Found ${allRequests.length} join requests for this ride offer`,
            { theRide, allRequests }
        );
    },
    createRideOffer: (req, res) => {
        // details of ride offer to create
        const rideOffer = {
            id: rides.length + 1,
            ...req.body
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
