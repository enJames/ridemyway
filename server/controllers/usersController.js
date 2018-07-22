import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import connectionPool from '../models/connectionPool';
import Reusables from '../Reusables';

dotenv.config();
const { sendResponse } = Reusables;

const usersController = {
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
                            return sendResponse(res, 401, 'fail', 'Email or password incorrect');
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
    dashboard: (req, res) => {
        const { userId } = req.authData;
        const responseObject = {};

        connectionPool.query(`SELECT * FROM "RideOffers" WHERE "userId" = '${userId}'`)
            .then((rideData) => {
                const runningOffer = rideData.rows[0];

                if (!runningOffer) {
                    responseObject.runningOffer = 'You currently do not have any running ride offer.';
                } else {
                    responseObject.runningOffer = runningOffer;
                }

                connectionPool.query(
                    `SELECT "fromState", "toState", "departureDate", "departureTime" FROM "RideOffers"
                    JOIN "JoinRide" ON "RideOffers"."id" = "JoinRide"."rideId"
                    WHERE "JoinRide"."userId" = ${userId}`
                )
                    .then((joinRideData) => {
                        const runningJoinRequest = joinRideData.rows[0];

                        if (!runningJoinRequest) {
                            responseObject.runningJoinRequest = 'You currently do not have any join ride request.';
                        } else {
                            responseObject.runningJoinRequest = runningJoinRequest;
                        }

                        return sendResponse(res, 200, 'success', 'fetched dashboard details', responseObject);
                    })
                    .catch(error => sendResponse(res, 500, 'fail', 'Error fetching join request', error.details));
            })
            .catch(error => sendResponse(res, 500, 'fail', 'Error fetching ride offer details', error.details));
    },
    sendUserProfile: (req, res) => {
        const { userId } = req.authData;

        connectionPool.query(
            `SELECT "firstname", "lastname", "email", "gender", "phone", "city", "state", "imgUrl", "completeness"
            FROM "Users" WHERE "id" = ${userId}`
        )
            .then((userData) => {
                const user = userData.rows[0];

                if (!user) {
                    return sendResponse(res, 404, 'fail', 'User does not exist');
                }

                return sendResponse(res, 200, 'success', 'User found', user);
            });
    },
    editUserProfile: (req, res) => {
        const userId = req.authData;
        const {
            firstname, lastname, email, gender, phone, city, state
        } = req.body;

        connectionPool.query(
            `UPDATE "Users"
            SET
                "firstname" = '${firstname}',
                "lastname" = '${lastname}',
                "email" = '${email}',
                "gender" = '${gender}',
                "phone" = '${phone}',
                "city" = '${city}',
                "state" = '${state}',
                "completeness" = '88%'
            WHERE "id" = ${userId}`
        )
            .then(() => sendResponse(res, 200, 'success', 'Profile updated'));
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
