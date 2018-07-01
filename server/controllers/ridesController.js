import connectionPool from '../models/connectionPool';
import Reusables from '../Reusables';

const { sendResponse } = Reusables;

const ridesController = {
    getAllRideOffers: (req, res) => connectionPool.query('SELECT * FROM "RideOffers"')
        .then(rideData => sendResponse(res, 200, 'success', rideData.rows)),
    getARideOffer: (req, res) => {
        const { rideId } = req.params;
        // Search for the ride
        connectionPool.query(`SELECT * FROM "RideOffers" WHERE "id" = ${rideId}`)
            .then((rideData) => {
                if (!rideData.rows[0]) {
                    return sendResponse(res, 404, 'fail', 'resource non-existent');
                }
                return sendResponse(res, 200, 'success', rideData.rows[0]);
            });
    },
    joinRide: (req, res) => {
        const { rideId } = req.params;
        const { userId } = req.authData;
        // Check that ride exists
        connectionPool.query(`SELECT "userId" FROM "RideOffers" WHERE "id" = '${rideId}'`)
            .then((rideData) => {
                if (!rideData.rows[0]) {
                    return sendResponse(res, 404, 'fail', 'resource non-existent');
                }
                const rideCreatorId = rideData.rows[0].userId;

                // Check that user is not trying to join his own ride
                if (rideCreatorId === userId) {
                    return sendResponse(res, 405, 'fail', 'cannot join own ride');
                }

                // Search relationship status between ride creator and request initiator
                connectionPool.query(
                    `SELECT "status" FROM "Friends" WHERE ("userId" = ${rideCreatorId} AND "friendId" = ${userId}) OR ("userId" = ${userId} AND "friendId" = ${rideCreatorId})`
                )
                    .then((statusData) => {
                        // Retrieve ride creators' firstname and lastname
                        connectionPool.query(
                            `SELECT "firstname", "lastname" FROM "Users"
                            WHERE "id" = '${rideCreatorId}'`
                        )
                            .then((userData) => {
                                const { firstname, lastname } = userData.rows[0];
                                // Check relationship status between creator and initiator
                                if (!statusData.rows[0] || !(statusData.rows[0].status === 'friends')) {
                                    const response = `You cannot join the ride because you are not friends with ${firstname} ${lastname}`;

                                    return sendResponse(res, 405, 'fail', response);
                                }

                                // Persist join request to database
                                connectionPool.query(`INSERT INTO
                                    "JoinRide" ("rideId", "userId", "status")
                                    VALUES ('${rideId}', '${userId}', 'pending')`)
                                    .then(() => {
                                        const response = `Your join request has been processed and its pending ${firstname}'s response`;
                                        return sendResponse(res, 201, 'success', response);
                                    });
                            });
                    });
            });
    }
};

export default ridesController;
