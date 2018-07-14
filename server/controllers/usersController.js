import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import connectionPool from '../models/connectionPool';
import Reusables from '../Reusables';

dotenv.config();
const { sendResponse } = Reusables;

const usersController = {
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
        // Get userId from jwt
        // Persist users data to database
        connectionPool.query(`INSERT INTO "RideOffers" (
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
        )`)
            .then(() => sendResponse(res, 201, 'success', 'ride offer created'))
            .catch(error => sendResponse(res, 500, 'error', 'connection error while attempting to sign you up', error));
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
    },
    createUser: (req, res) => {
        const { firstname, email, password } = req.body;

        // Hash the password
        bcrypt
            .hash(password, 10)
            .then(hash => connectionPool.query(
                `INSERT INTO "Users" ("firstname", "email", "password")
                VALUES ('${firstname}','${email}', '${hash}') RETURNING *`
            )
                .then((userData) => {
                    const user = userData.rows[0];

                    // Info to store in token
                    const authData = {
                        userId: user.id,
                        email: user.email
                    };

                    // Create token
                    const token = jwt.sign(
                        authData,
                        process.env.secret,
                        { expiresIn: '2h' }
                    );

                    // Save token in the cookie
                    res.cookie('token', token, {
                        httpOnly: true,
                        maxAge: (1000 * 60 * 60 * 2)
                    });

                    return sendResponse(res, 201, 'success', 'your account has been created');
                }))
            .catch(error => sendResponse(res, 500, 'error', 'connection error', error));
    },
    loginUser: (req, res) => {
        const { email, password } = req.body;

        connectionPool.query(
            `SELECT "id", "email", "password", "firstname", "lastname"
            FROM "Users" WHERE "email" = '${email}'`
        )
            .then((userData) => {
                const user = userData.rows[0];

                if (!user) {
                    return sendResponse(res, 401, 'fail', 'Email or password incorrect');
                }
                // Compare hashed password
                bcrypt.compare(password, user.password)
                    .then((result) => {
                        if (!result) {
                            return sendResponse(res, 500, 'error', 'cannot sign you in at the moment');
                        }

                        // Info to store in token
                        const authData = {
                            userId: user.id,
                            email: user.email
                        };

                        // Create token
                        const token = jwt.sign(
                            authData,
                            process.env.secret,
                            { expiresIn: '2h' }
                        );

                        // Save token in the cookie
                        res.cookie('token', token, {
                            httpOnly: true,
                            maxAge: (1000 * 60 * 60 * 2)
                        });

                        return sendResponse(res, 200, 'success', 'account logged in');
                    });
            });
    },
    logOutUser: (req, res) => {
        // If logged in, redirect to dashboard
        if (!req.cookies.token) {
            return sendResponse(res, 403, 'fail', 'No logged in account');
        }

        const decoded = jwt.verify(req.cookies.token, process.env.secret);

        if (!decoded.userId) {
            return sendResponse(res, 403, 'fail', 'An unusual event occurred');
        }
        // Clear cookie
        res.clearCookie('token');

        return sendResponse(res, 200, 'success', 'account logged out');
    }
};

export default usersController;
