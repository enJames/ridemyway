import connectionPool from './connectionPool';
import seedData from './seedData';

const {
    user, rideOffer, joinRide
} = seedData;


const Models = () => {
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
            user();
            connectionPool.query(`CREATE TABLE IF NOT EXISTS "RideOffers" (
                "id" SERIAL PRIMARY KEY,
                "fromState" VARCHAR NOT NULL,
                "fromCity" VARCHAR NOT NULL,
                "toState" VARCHAR NOT NULL,
                "toCity" VARCHAR NOT NULL,
                "price" VARCHAR NOT NULL,
                "seats" INTEGER NOT NULL,
                "departureDate" date NOT NULL,
                "departureTime" TIME NOT NULL,
                "pickupLocation" VARCHAR NOT NULL,
                "userId" INTEGER REFERENCES "Users" (id) ON DELETE CASCADE,
                "createdAt" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP)`)
                .then(() => {
                    rideOffer();
                    // Create JoinRide Table
                    connectionPool.query(`CREATE TABLE IF NOT EXISTS "JoinRide" (
                        id SERIAL PRIMARY KEY,
                        "rideId" INTEGER REFERENCES "RideOffers" (id) ON DELETE CASCADE,
                        "userId" INTEGER REFERENCES "Users" (id) ON DELETE CASCADE,
                        status VARCHAR NOT NULL,
                        "createdAt" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        "updatedAt" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP)`)
                        .then(() => joinRide());
                });
        });
};

export default Models;
