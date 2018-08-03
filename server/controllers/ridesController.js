import connectionPool from '../models/connectionPool';
import Reusables from '../Reusables';

const { sendResponse } = Reusables;

const ridesController = {
    getAllRideOffers: (req, res) => connectionPool.query('SELECT * FROM "RideOffers"')
        .then((rideData) => {
            if (!rideData.rows.length === 0) {
                return sendResponse(res, 404, 'fail', 'No ride offers yet');
            }
            return sendResponse(res, 200, 'success', 'All ride offers', rideData.rows);
        })
        .catch(error => sendResponse(res, 500, 'error', 'Connection error while fetching rides', error)),
    getARideOffer: (req, res) => {
        const { rideId } = req.params;
        // Search for the ride
        connectionPool.query(`SELECT * FROM "RideOffers" WHERE "id" = '${rideId}'`)
            .then((rideData) => {
                const rideDetails = rideData.rows[0];

                // If ride does not
                if (!rideDetails) {
                    return sendResponse(res, 404, 'fail', 'Ride does not exist');
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
            });
    },
    joinRide: (req, res) => {
        const { rideId } = req.params;
        const { userId } = req.authData;
        // Check that ride exists
        connectionPool.query(
            `SELECT "availableSeats", "status", "userId" FROM "RideOffers"
                WHERE "id" = '${rideId}'`
        )
            .then((rideData) => {
                if (!rideData.rows[0]) {
                    return sendResponse(res, 404, 'fail', 'Ride does not exist');
                }
                const rideCreatorId = rideData.rows[0].userId;
                const {
                    availableSeats, status
                } = rideData.rows[0];

                // Check that user is not trying to join his own ride
                if (rideCreatorId === userId) {
                    return sendResponse(res, 405, 'fail', 'You cannot join your own ride');
                }

                // Check if ride is fully booked
                if (availableSeats === 0 || availableSeats === '0') {
                    return sendResponse(res, 403, 'fail', 'Ride is fully booked');
                }

                // Check if ride has expired
                if (status === 'expired') {
                    return sendResponse(res, 403, 'fail', 'Ride is expired');
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
                                if (joinRideData.rows.length > 0) {
                                    return sendResponse(res, 405, 'fail', 'You already joined this ride');
                                }
                                // Persist join request to database
                                connectionPool.query(
                                    `INSERT INTO "JoinRide" ("rideId", "userId", "status")
                                        VALUES ('${rideId}', '${userId}', 'pending')`
                                )
                                    .then(() => {
                                        const response = `Your join request has been processed and its pending ${firstname}'s response`;
                                        return sendResponse(res, 201, 'success', response);
                                    });
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
        let tomorrow;

        if (month > 9) {
            tomorrow = `${now.getFullYear()}-${month}-${now.getDate() + 1}`;
        } else {
            tomorrow = `${now.getFullYear()}-0${month}-${now.getDate() + 1}`;
        }

        if (departureDate < tomorrow) {
            return sendResponse(res, 405, 'fail', 'Departure is in the past or too sudden. Consider changing to a later date');
        }

        // check that user has no pending ride offer
        connectionPool.query(`SELECT * FROM "RideOffers" WHERE "userId" = '${userId}' AND "departureDate" >= NOW()::date`)
            .then((rideData) => {
                if (rideData.rows.length > 0) {
                    return sendResponse(res, 405, 'fail', 'You still have a pending ride offer');
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
                        "acceptedRequests",
                        "availableSeats",
                        "departureDate",
                        "departureTime",
                        "pickupLocation",
                        "status",
                        "userId"
                    ) VALUES (
                        '${fromState}',
                        '${fromCity}',
                        '${toState}',
                        '${toCity}',
                        '${price}',
                        '${seats}',
                        '0',
                        '${seats}',
                        '${departureDate}',
                        '${departureTime}',
                        '${pickupLocation}',
                        'Running',
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
                    `SELECT "JoinRide"."id" as "requestId", "JoinRide"."status", "Users"."id" as "userId", "firstname", "lastname", "phone", "imgUrl"
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
                        const responseObject = {
                            rideOffer,
                            requestedUsers
                        };
                        return sendResponse(res, 200, 'success', `found ${requestedUsers.length} requests`, responseObject);
                    });
            });
    },
    acceptRejectRideRequest: (req, res) => {
        const { rideId, requestId } = req.params;
        const { action } = req.body;

        if (action !== 'accept' && action !== 'decline') {
            return sendResponse(res, 400, 'fail', 'Action must be explicitly stated as either "accept" or "decline"');
        }

        connectionPool.query(
            `SELECT * FROM "JoinRide" WHERE "id" = '${requestId}' AND "rideId" = '${rideId}'`
        )
            .then((requestData) => {
                const request = requestData.rows[0];
                if (!request) {
                    return sendResponse(res, 404, 'fail', 'Request does not exist');
                }

                if (request.status === 'pending') {
                    if (action === 'accept') {
                        return connectionPool.query(
                            `UPDATE "JoinRide"
                            SET "status" = 'accepted'
                            WHERE "id" = '${requestId}' AND "rideId" = '${rideId}'`
                        )
                            .then(() => connectionPool.query(
                                `SELECT "seats", "acceptedRequests", "userId" FROM "RideOffers"
                                    WHERE "id" = '${rideId}' AND "status" = 'Running'`
                            )
                                .then((rideData) => {
                                    const {
                                        seats, acceptedRequests, userId
                                    } = rideData.rows[0];
                                    const seatsInt = parseInt(seats, 10);
                                    const acceptedRequestsInt = parseInt(acceptedRequests, 10);
                                    const newAcceptedRequests = acceptedRequestsInt + 1;

                                    const newAvailableSeats = seatsInt - newAcceptedRequests;

                                    return connectionPool.query(
                                        `UPDATE "RideOffers" SET
                                            "acceptedRequests" = ${newAcceptedRequests},
                                            "availableSeats" = ${newAvailableSeats}
                                        WHERE "id" = ${rideId} AND "userId" = ${userId}`
                                    )
                                        .then(() => connectionPool.query(
                                            `SELECT "firstname", "lastname" FROM "Users"
                                                WHERE "id" = ${request.userId}`
                                        )
                                            .then((userData) => {
                                                const {
                                                    firstname, lastname
                                                } = userData.rows[0];
                                                return sendResponse(
                                                    res, 200, 'success', `${firstname} ${lastname} has been added to your ride successfully.`
                                                );
                                            }));
                                }));
                    }
                    if (action === 'decline') {
                        return connectionPool.query(
                            `UPDATE "JoinRide" SET "status" = 'declined'
                            WHERE "id" = '${requestId}' AND "rideId" = '${rideId}'`
                        )
                            .then(() => sendResponse(res, 200, 'success', 'Declined ride request successfully'));
                    }

                    return sendResponse(res, 405, 'fail', 'Request not understood');
                }

                if (request.status === 'accepted') {
                    if (action === 'accept') {
                        return sendResponse(res, 400, 'fail', 'You already accepted this request');
                    }
                    if (action === 'decline') {
                        return connectionPool.query(
                            `UPDATE "JoinRide" SET "status" = 'declined'
                            WHERE "id" = '${requestId}' AND "rideId" = '${rideId}'`
                        )
                            .then(() => connectionPool.query(
                                `SELECT "seats", "acceptedRequests", "userId" FROM "RideOffers"
                                        WHERE "id" = '${rideId}' AND "status" = 'Running'`
                            )
                                .then((rideData) => {
                                    const {
                                        seats, acceptedRequests, userId
                                    } = rideData.rows[0];
                                    const seatsInt = parseInt(seats, 10);
                                    const acceptedRequestsInt = parseInt(acceptedRequests, 10);
                                    const newAcceptedRequests = acceptedRequestsInt - 1;

                                    const newAvailableSeats = seatsInt - newAcceptedRequests;
                                    connectionPool.query(
                                        `UPDATE "RideOffers" SET
                                            "acceptedRequests" = ${newAcceptedRequests},
                                            "availableSeats" = ${newAvailableSeats}
                                        WHERE "id" = ${rideId} AND "userId" = ${userId}`
                                    )
                                        .then(() => connectionPool.query(
                                            `SELECT "firstname", "lastname" FROM "Users"
                                                WHERE "id" = ${request.userId}`
                                        )
                                            .then((userData) => {
                                                const {
                                                    firstname, lastname
                                                } = userData.rows[0];
                                                return sendResponse(
                                                    res, 200, 'success', `${firstname} ${lastname} has been removed from your successfully.`
                                                );
                                            }));
                                }));
                    }
                    return sendResponse(res, 400, 'fail', 'Request not understood');
                }

                // if request.status is decline
                return sendResponse(res, 400, 'fail', 'Declined requests cannot be accepted again');
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
            seats,
            departureDate,
            departureTime,
            pickupLocation
        } = req.body;

        // Query database to get number of accepted requests

        connectionPool.query(
            `UPDATE "RideOffers" SET
                "fromState"='${fromState}',
                "fromCity"='${fromCity}',
                "toState"='${toState}',
                "toCity"='${toCity}',
                "price"='${price}',
                "seats"='${seats}',
                "departureDate"='${departureDate}',
                "departureTime"='${departureTime}',
                "pickupLocation"='${pickupLocation}'
            WHERE "id" = '${rideId}' AND "userId" = '${userId}' RETURNING *`
        )
            .then(() => sendResponse(res, 200, 'success', 'ride offer updated'))
            .catch(error => sendResponse(res, 500, 'error', 'connection error while attempting to update ride offer', error));
    },
    cancelRideOffer: (req, res) => {
        const { rideId } = req.params;
        const { userId } = req.authData;

        connectionPool.query(
            `UPDATE "RideOffers" SET status = 'Cancelled'
            WHERE "id" = '${rideId}' AND "userId" = '${userId}'`
        )
            .then(() => sendResponse(res, 200, 'success', 'Trip cancelled successfully'));
    }
};

export default ridesController;
