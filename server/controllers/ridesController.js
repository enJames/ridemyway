import connectionPool from '../models/connectionPool';
import Reusables from '../Reusables';

const { sendResponse } = Reusables;

const ridesController = {
    getAllRideOffers: (req, res) => connectionPool.query('SELECT * FROM "RideOffers"')
        .then((rideData) => {
            if (!rideData.rows.length === 0) {
                return sendResponse(res, 404, 'fail', 'No ride offers yet');
            }
            return sendResponse(res, 200, 'success', 'all ride offers', rideData.rows);
        })
        .catch(error => sendResponse(res, 500, 'error', 'connection error while fetching rides', error)),
    getARideOffer: (req, res) => {
        const { rideId } = req.params;
        // Search for the ride
        connectionPool.query(`SELECT * FROM "RideOffers" WHERE "id" = '${rideId}'`)
            .then((rideData) => {
                const rideDetails = rideData.rows[0];

                // If ride does not
                if (!rideDetails) {
                    return sendResponse(res, 404, 'fail', 'ride does not exist');
                }

                connectionPool.query(
                    `SELECT "id", "firstname", "lastname" FROM "Users" WHERE "id"='${rideDetails.userId}'`
                )
                    .then((userData) => {
                        const driver = userData.rows[0];

                        const responseObject = {
                            rideDetails,
                            driver
                        };

                        return sendResponse(res, 200, 'success', 'Ride found', responseObject);
                    });
            })
            .catch(error => sendResponse(res, 500, 'error', 'connection error while fetching ride', error));
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
    },
    createRideOffer: (req, res) => {
        const { userId } = req.authData;

        const {
            fromState,
            fromCity,
            toState,
            toCity,
            price,
            seats,
            departureDate,
            departureTime,
            pickupLocation
        } = req.body;

        // Get current date in user's format for comparison
        const now = new Date();
        const month = now.getMonth() + 1;
        let today;

        if (month > 9) {
            today = `${now.getFullYear()}-${month}-${now.getDate()}`;
        } else {
            today = `${now.getFullYear()}-0${now.getMonth()}-${now.getDate()}`;
        }

        if (!departureDate >= today) {
            return sendResponse(res, 405, 'fail', 'Departure date is too sudden. Consider changing to a later date');
        }

        // check that user has no pending ride offer
        connectionPool.query(`SELECT * FROM "RideOffers" WHERE "userId" = ${userId} AND "departureDate" >= NOW()::date`)
            .then((rideData) => {
                if (rideData.rows.length > 0) {
                    return sendResponse(res, 200, 'fail', 'You still have a pending ride offer');
                }

                // If no pending ride offer, create ride offer
                connectionPool.query(
                    `INSERT INTO "RideOffers" (
                        "fromState",
                        "fromCity",
                        "toState",
                        "toCity",
                        "price",
                        "seats",
                        "departureDate",
                        "departureTime",
                        "pickupLocation",
                        "userId"
                    ) VALUES (
                        '${fromState}',
                        '${fromCity}',
                        '${toState}',
                        '${toCity}',
                        '${price}',
                        '${seats}',
                        '${departureDate}',
                        '${departureTime}',
                        '${pickupLocation}',
                        '${userId}'
                    )`
                )
                    .then(() => sendResponse(res, 201, 'success', 'Ride offer created'));
            });
    },
    getAllJoinRequests: (req, res) => {
        const { rideId } = req.params;
        // Search for the ride
        connectionPool.query(`SELECT * FROM "RideOffers" WHERE "id" = ${rideId}`)
            .then((rideData) => {
                const rideOffer = rideData.rows[0];

                // Search for the Users that requested to join the ride
                connectionPool.query(
                    `SELECT "firstname", "lastname", "phone", "imgUrl"
                        FROM "JoinRide"
                        JOIN "RideOffers" ON "JoinRide"."rideId" = "RideOffers"."id"
                        JOIN "Users" ON "JoinRide"."userId" = "Users"."id"
                        WHERE "RideOffers"."id" = ${rideId}`
                )
                    .then((usersData) => {
                        const requestedUsers = usersData.rows;

                        if (requestedUsers.length === 0) {
                            return sendResponse(res, 404, 'fail', 'No requests for this ride yet');
                        }

                        // Ride offer and requested users
                        const result = {
                            rideOffer,
                            requestedUsers
                        };
                        return sendResponse(res, 200, 'success', `found ${requestedUsers.length} requests`, result);
                    })
                    .catch(error => sendResponse(res, 500, 'error', 'connection error', error));
            })
            .catch(error => sendResponse(res, 500, 'error', 'connection error', error));
    },
    acceptRejectRideRequest: (req, res) => {
        const { rideId, requestId } = req.params;
        const { action } = req.body;

        if (action !== 'accept' && action !== 'decline') {
            return sendResponse(res, 400, 'fail', 'action must be explicitly stated as either "accept" or "decline"');
        }

        connectionPool.query(
            `SELECT * FROM "JoinRide" WHERE "id" = '${requestId}' AND "rideId" = '${rideId}'`
        )
            .then((requestData) => {
                const request = requestData.rows[0];
                if (!request) {
                    return sendResponse(res, 404, 'fail', 'request does not exist');
                }

                if (request.status === 'pending') {
                    if (action === 'accept') {
                        connectionPool.query(
                            `UPDATE "JoinRide"
                            SET "status" = 'accepted'
                            WHERE "id" = '${requestId}' AND "rideId" = '${rideId}'`
                        )
                            .then(() => sendResponse(res, 200, 'success', 'accepted ride request successfully'));
                    }
                    if (action === 'decline') {
                        connectionPool.query(
                            `UPDATE "JoinRide" SET "status" = 'declined'
                            WHERE "id" = '${requestId}' AND "rideId" = '${rideId}'`
                        )
                            .then(() => sendResponse(res, 200, 'success', 'declined ride request successfully'));
                    }

                    return sendResponse(res, 404, 'fail', 'request not understood');
                }

                if (request.status === 'accept') {
                    if (action === 'accept') {
                        return sendResponse(res, 400, 'fail', 'You already accepted this request');
                    }
                    if (action === 'decline') {
                        connectionPool.query(
                            `UPDATE "JoinRide" SET "status" = 'declined'
                            WHERE "id" = '${requestId}' AND "rideId" = '${rideId}'`
                        )
                            .then(() => sendResponse(res, 200, 'success', 'declined ride request successfully'));
                    }
                    return sendResponse(res, 400, 'fail', 'request not understood');
                }

                // if request.status is decline
                if (action === 'accept') {
                    connectionPool.query(
                        `UPDATE "JoinRide"
                        SET "status" = 'accepted'
                        WHERE "id" = '${requestId}' AND "rideId" = '${rideId}'`
                    )
                        .then(() => sendResponse(res, 200, 'success', 'accepted ride request successfully'));
                }
                if (action === 'decline') {
                    return sendResponse(res, 400, 'fail', 'you already declined request');
                }
            });
    },
    updateRideOffer: (req, res) => {
        const { rideId } = req.params;
        const { userId } = req.authData;

        const {
            fromState,
            fromCity,
            toState,
            toCity,
            price,
            departureDate,
            departureTime,
            pickupLocation
        } = req.body;

        connectionPool.query(
            `UPDATE "RideOffers" SET
                "fromState"='${fromState}',
                "fromCity"='${fromCity}',
                "toState"='${toState}',
                "toCity"='${toCity}',
                "price"='${price}',
                "departureDate"='${departureDate}',
                "departureTime"='${departureTime}',
                "pickupLocation"='${pickupLocation}'
            WHERE "id" = '${rideId}' AND "userId" = '${userId}' RETURNING *`
        )
            .then(() => sendResponse(res, 200, 'success', 'ride offer updated'))
            .catch(error => sendResponse(res, 500, 'error', 'connection error while attempting to update ride offer', error));
    },
    deleteRideOffer: (req, res) => {
        const { rideId } = req.params;
        const { userId } = req.authData;

        connectionPool.query(
            `DELETE FROM "RideOffers" WHERE "id" = '${rideId}'
            AND "userId" = '${userId}'`
        )
            .then(() => sendResponse(res, 200, 'success', 'ride offer deleted'))
            .catch(error => sendResponse(res, 500, 'error', 'connection error while attempting to delete ride offer', error));
    }
};

export default ridesController;
