import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import cloudinary from 'cloudinary';
import jwt from 'jsonwebtoken';
import connectionPool from '../models/connectionPool';
import Reusables from '../Reusables';

dotenv.config();
const { sendResponse, checkProfileCompleteness } = Reusables;

const usersController = {
    createUser: (req, res) => {
        const { firstname, email, password } = req.body;

        // Hash the password
        bcrypt
            .hash(password, 10)
            .then(hash => connectionPool.query(
                `INSERT INTO "Users" ("firstname", "email", "password", "completeness")
                VALUES ('${firstname}','${email}', '${hash}', '33%') RETURNING *`
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

                    return sendResponse(res, 201, 'success', 'Your account has been created');
                }))
            .catch((error) => {
                if (error.detail.indexOf('email') !== -1) {
                    return sendResponse(res, 500, 'error', 'Email already exists');
                }
                return sendResponse(res, 500, 'error', 'Error while communicating with the database', error);
            });
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

                        return sendResponse(res, 200, 'success', 'Account logged in');
                    });
            });
    },
    dashboard: (req, res) => {
        const { userId } = req.authData;
        const responseObject = {};

        connectionPool.query(`SELECT * FROM "RideOffers" WHERE "userId" = '${userId}' AND status = 'Running'`)
            .then((rideData) => {
                const runningOffer = rideData.rows[0];

                if (!runningOffer) {
                    responseObject.runningOffer = 'You currently do not have any running ride offer.';
                } else {
                    responseObject.runningOffer = runningOffer;
                }

                connectionPool.query(
                    `SELECT "RideOffers"."id", "fromState", "toState", "departureDate", "departureTime" FROM "RideOffers"
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
            `SELECT "id", "firstname", "lastname", "email", "gender", "phone", "city", "state", "imgUrl", "completeness"
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
        const { userId } = req.authData;
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
                "updatedAt" = NOW()
            WHERE "id" = ${userId} RETURNING *`
        )
            .then((completenessData) => {
                const percentage = checkProfileCompleteness(completenessData.rows[0]);

                // Update completeness column
                connectionPool.query(
                    `UPDATE "Users"
                    SET
                        "completeness" = '${percentage}'
                    WHERE "id" = ${userId} RETURNING "completeness"`
                )
                    .then(updatedData => sendResponse(res, 200, 'success', 'Profile updated', updatedData.rows[0]));
            });
    },
    uploadImage: (req, res) => {
        const { userId } = req.authData;

        if (!req.files.image) {
            return sendResponse(res, 200, 'fail', 'No image uploaded');
        }

        // Retrieve file path from temp storage
        const { file } = req.files.image;

        // Upload to cloudinary
        cloudinary.uploader.upload(file)
            .then((result) => {
                // Update database with image url
                connectionPool.query(
                    `UPDATE "Users" SET
                        "imgUrl" = '${result.url}'
                    WHERE "id" = ${userId} RETURNING "imgUrl"`
                )
                    .then((imgData) => {
                        const percentage = checkProfileCompleteness(imgData.rows[0]);

                        // Update completeness column
                        connectionPool.query(
                            `UPDATE "Users"
                            SET
                                "completeness" = '${percentage}'
                            WHERE "id" = ${userId} RETURNING *`
                        )
                            .then(() => sendResponse(res, 200, 'success', 'Image uploaded', imgData.rows[0].imgUrl));
                    });
            });
    },
    rideOwnerProfile: (req, res) => {
        const { rideOwnerId } = req.params;

        connectionPool.query(
            `SELECT "id", "firstname", "lastname", "email", "gender", "phone", "city", "state", "imgUrl"
            FROM "Users" WHERE "id" = ${rideOwnerId}`
        )
            .then((rideOwnerData) => {
                const rideOwner = rideOwnerData.rows[0];

                if (!rideOwner) {
                    return sendResponse(res, 404, 'fail', 'Ride owner does not exist');
                }

                return sendResponse(res, 200, 'success', 'Rider owner found', rideOwner);
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

        return sendResponse(res, 200, 'success', 'Account logged out');
    }
};

export default usersController;
