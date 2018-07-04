import connectionPool from '../models/connectionPool';
import Reusables from '../Reusables';

const { sendResponse } = Reusables;

const ridesController = {
    getAllRideOffers: (req, res) => connectionPool.query('SELECT * FROM "RideOffers"')
        .then(rideData => sendResponse(res, 200, 'success', 'all ride offers', rideData.rows))
        .catch(error => sendResponse(res, 500, 'error', 'connection error[Get]', error)),
    getARideOffer: (req, res) => {
        const { rideId } = req.params;
        // Search for the ride
        connectionPool.query(`SELECT * FROM "RideOffers" WHERE "id" = ${rideId}`)
            .then((rideData) => {
                if (!rideData.rows[0]) {
                    return sendResponse(res, 404, 'fail', 'ride does not exist');
                }
                return sendResponse(res, 200, 'success', 'Ride found', rideData.rows[0]);
            });
    },
    joinRide: (req, res) => {
        const { rideId } = req.params;
        const { userId } = req.authData;
        // Check that ride exists
        connectionPool.query(`SELECT "userId" FROM "RideOffers" WHERE "id" = '${rideId}'`)
            .then((rideData) => {
                if (!rideData.rows[0]) {
                    return sendResponse(res, 404, 'fail', 'ride does not exist');
                }
                const rideCreatorId = rideData.rows[0].userId;

                // Check that user is not trying to join his own ride
                if (rideCreatorId === userId) {
                    return sendResponse(res, 405, 'fail', 'You cannot join your own ride');
                }

                // Retrieve ride creators' firstname and lastname
                return connectionPool.query(
                    `SELECT "firstname" FROM "Users" WHERE "id" = '${rideCreatorId}'`
                )
                    .then((userData) => {
                        const { firstname } = userData.rows[0];

                        // Check if user already joined the ride
                        connectionPool.query(
                            `SELECT * FROM "JoinRide" WHERE "userId" = ${userId} AND "rideId" = ${rideId}`
                        )
                            .then((joinRideData) => {
                                // check if results were returned
                                if (!joinRideData.rows[0]) {
                                    // Persist join request to database
                                    connectionPool.query(
                                        `INSERT INTO "JoinRide" ("rideId", "userId", "status")
                                        VALUES ('${rideId}', '${userId}', 'pending')`
                                    )
                                        .then(() => {
                                            const response = `Your join request has been processed and its pending ${firstname}'s response`;
                                            return sendResponse(res, 201, 'success', response);
                                        });
                                }
                                return sendResponse(res, 405, 'fail', 'You already joined this ride');
                            });
                    });
            });
    }
};

export default ridesController;
