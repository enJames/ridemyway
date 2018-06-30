import connectionPool from './connectionPool';
import Reusables from '../Reusables';

const { sendResponse } = Reusables;
const onErrorMessage = 'Unable to communicate to the database';

const Models = (req, res) => {
    // Create Users Table
    connectionPool.query(`CREATE TABLE IF NOT EXISTS "Users" (
        "id" SERIAL PRIMARY KEY,
        "firstname" VARCHAR NOT NULL,
        "lastname" VARCHAR NOT NULL,
        "email" VARCHAR NOT NULL UNIQUE,
        "password" VARCHAR NOT NULL,
        "gender" VARCHAR NOT NULL,
        "phone" VARCHAR NOT NULL UNIQUE,
        "city" VARCHAR NOT NULL,
        "state" VARCHAR NOT NULL,
        "imgUrl" VARCHAR,
        "rating" NUMERIC,
        "createdAt" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP)`)
        .then(() => {
            // Create Ratings table
            connectionPool.query(`CREATE TABLE IF NOT EXISTS "Ratings" (
                id SERIAL PRIMARY KEY,
                "userId" INTEGER NOT NULL,
                rating NUMERIC NOT NULL,
                "createdAt" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP)`)
                .then(() => {
                    // Create Friends table
                    connectionPool.query(`CREATE TABLE IF NOT EXISTS "Friends" (
                        "id" SERIAL PRIMARY KEY,
                        "userId" INTEGER REFERENCES "Users" (id) ON DELETE CASCADE,
                        "friendId" INTEGER REFERENCES "Users" (id) ON DELETE CASCADE,
                        "status" VARCHAR NOT NULL,
                        "createdAt" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        "updatedAt" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP)`)
                        .then(() => {
                            // Create RideOffers Table
                            connectionPool.query(`CREATE TABLE IF NOT EXISTS "RideOffers" (
                                "id" SERIAL PRIMARY KEY,
                                "fromState" VARCHAR NOT NULL,
                                "fromCity" VARCHAR NOT NULL,
                                "toState" VARCHAR NOT NULL,
                                "toCity" VARCHAR NOT NULL,
                                "price" VARCHAR NOT NULL,
                                "departureDate" date NOT NULL,
                                "departureTime" TIME NOT NULL,
                                "pickupLocation" VARCHAR NOT NULL,
                                "userId" INTEGER REFERENCES "Users" (id) ON DELETE CASCADE,
                                "createdAt" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                "updatedAt" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP)`)
                                .then(() => {
                                    // Create JoinRide Table
                                    connectionPool.query(`CREATE TABLE IF NOT EXISTS "JoinRide" (
                                        id SERIAL PRIMARY KEY,
                                        "rideId" INTEGER REFERENCES "RideOffers" (id) ON DELETE CASCADE,
                                        "userId" INTEGER REFERENCES "Users" (id) ON DELETE CASCADE,
                                        status VARCHAR NOT NULL,
                                        "createdAt" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                        "updatedAt" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP)`)
                                        .catch(() => sendResponse(res, 500, 'error', null, onErrorMessage));
                                })
                                .catch(() => sendResponse(res, 500, 'error', null, onErrorMessage));
                        })
                        .catch(() => sendResponse(res, 500, 'error', null, onErrorMessage));
                })
                .catch(() => sendResponse(res, 500, 'error', null, onErrorMessage));
        })
        .catch(() => sendResponse(res, 500, 'error', null, onErrorMessage));
};

export default Models;
