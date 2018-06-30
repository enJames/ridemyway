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
            '${departureDate}',
            '${departureTime}',
            '${pickupLocation}',
            '${userId}'
        )`)
            .then((data) => {
                const rideData = data.rows[0];
                return sendResponse(res, 201, 'success', rideData);
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
                    `SELECT "firstname", "lastname", "phone", "imgUrl", "rating"
                        FROM "JoinRide"
                        JOIN "RideOffers" ON "JoinRide"."rideId" = "RideOffers"."id"
                        JOIN "Users" ON "JoinRide"."userId" = "Users"."id"
                        WHERE "RideOffers"."id" = ${rideId}`
                )
                    .then((usersData) => {
                        const requestedUsers = usersData.rows;

                        if (requestedUsers.length === 0) {
                            return sendResponse(res, 404, 'fail', 'No requests yet');
                        }

                        // Ride offer and requested users
                        const result = {
                            rideOffer,
                            requestedUsers
                        };
                        return sendResponse(res, 200, 'success', result);
                    })
                    .catch(error => sendResponse(res, 500, 'error', error));
            })
            .catch(error => sendResponse(res, 500, 'error', error));
    },
    acceptRejectRideRequest: (req, res) => {
        const { rideId, requestId } = req.params;
        const { action } = req.body;

        connectionPool.query(
            `SELECT * FROM "JoinRide" WHERE "id" = '${requestId}'`
        )
            .then((requestData) => {
                const request = requestData.rows[0];
                if (!request) {
                    return sendResponse(res, 404, 'fail', 'resource non-existent');
                }
                if (request.status === 'pending') {
                    if (action === 'accept') {
                        connectionPool.query(
                            `UPDATE "JoinRide"
                            SET "status" = 'accepted'
                            WHERE "id" = '${requestId}' AND "rideId" = '${rideId}')`
                        )
                            .then(() => sendResponse(res, 200, 'success', null))
                            .catch(error => sendResponse(res, 500, 'error', error));
                    }
                    connectionPool.query(
                        `UPDATE "JoinRide" SET "status" = 'declined'
                        WHERE "id" = '${requestId}' AND "rideId" = '${rideId}')`
                    )
                        .then(() => sendResponse(res, 200, 'success', null))
                        .catch(error => sendResponse(res, 500, 'error', error));
                }
                return sendResponse(res, 404, 'fail', 'request not understood');
            })
            .catch(error => sendResponse(res, 500, 'error', error));
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
            WHERE "id" = '${rideId}' AND "userId" = '${userId}'`
        )
            .then(() => sendResponse(res, 200, 'success', 'updated'))
            .catch(error => sendResponse(res, 500, 'error', error));
    },
    deleteRideOffer: (req, res) => {
        const { rideId } = req.params;
        const { userId } = req.authData;

        connectionPool.query(
            `DELETE FROM "RideOffers" WHERE "id" = '${rideId}'
            AND "userId" = '${userId}'`
        )
            .then(() => sendResponse(res, 200, 'success', 'updated'))
            .catch(error => sendResponse(res, 500, 'error', error));
    },
    createUser: (req, res) => {
        // If logged in, redirect to dashboard
        if (req.cookies.token) {
            return sendResponse(res, 500, 'fail', 'Already logged');
        }
        const {
            firstname,
            lastname,
            email,
            password,
            gender,
            phone,
            city,
            state
        } = req.body;

        // Hash the password
        bcrypt
            .hash(password, 10)
            .then((hash) => {
                // Persist users data to database
                connectionPool.query(`INSERT INTO "Users" (
                    "firstname",
                    "lastname",
                    "email",
                    "password",
                    "gender",
                    "phone",
                    "city",
                    "state") VALUES (
                    '${firstname}',
                    '${lastname}',
                    '${email}',
                    '${hash}',
                    '${gender}',
                    '${phone}',
                    '${city}',
                    '${state}'
                )`)
                    .then((data) => {
                        const userData = data.rows[0];
                        return sendResponse(res, 201, 'Sign up success', userData);
                    })
                    .catch(error => sendResponse(res, 500, 'error', error));
            });
    },
    loginUser: (req, res) => {
        // If logged in, redirect to dashboard
        if (req.cookies.token) {
            return sendResponse(res, 200, 'success', null);
        }
        const { email, password } = req.body;

        connectionPool.query(
            `SELECT "id", "email", "password", "firstname", "lastname"
            FROM "Users" WHERE "email" = '${email}'`
        )
            .then((userData) => {
                const user = userData.rows[0];
                if (user.email === email) {
                    // Compare hashed password
                    bcrypt.compare(password, user.password)
                        .then((result) => {
                            if (result) {
                                // Info to store in token
                                const authData = {
                                    userId: user.id
                                };

                                // Create token
                                const token = jwt.sign(
                                    authData,
                                    process.env.secret,
                                    { expiresIn: 240 }
                                );

                                // Save token in the cookie
                                res.cookie('token', token, {
                                    httpOnly: true,
                                    maxAge: (1000 * 60 * 5)
                                });
                                return sendResponse(res, 401, 'success', null);
                            }
                        })
                        .catch(error => sendResponse(res, 500, 'errorlgn', error));
                }
            })
            .catch(error => sendResponse(res, 500, 'errorQlgn', error));
    },
    logOutUser: (req, res) => {
        // If logged in, redirect to dashboard
        if (!req.cookies.token) {
            return sendResponse(res, 200, 'success', 'already logged out');
        }

        // Save token in the cookie
        res.cookie('token', null, {
            httpOnly: true,
            maxAge: (-1000)
        });

        return sendResponse(res, 200, 'success', 'logged out');
    }
};

export default usersController;
