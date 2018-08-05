import connectionPool from './connectionPool';

const Models = () => {
    // Set timezone to west african time then create tables if not exists
    connectionPool.query('SET TIME ZONE "GMT-1"')
        .then(() => {
            // Create Users Table
            connectionPool.query(`CREATE TABLE IF NOT EXISTS "Users" (
                "id" SERIAL PRIMARY KEY,
                "firstname" VARCHAR NOT NULL,
                "lastname" VARCHAR,
                "email" VARCHAR NOT NULL UNIQUE,
                "password" VARCHAR NOT NULL,
                "gender" VARCHAR,
                "phone" VARCHAR UNIQUE,
                "city" VARCHAR,
                "state" VARCHAR,
                "imgUrl" VARCHAR,
                "completeness" VARCHAR NOT NULL,
                "createdAt" DATE NOT NULL DEFAULT NOW(),
                "updatedAt" DATE NOT NULL DEFAULT NOW())`)
                .then(() => connectionPool.query(`CREATE TABLE IF NOT EXISTS "RideOffers" (
                        "id" SERIAL PRIMARY KEY,
                        "fromState" VARCHAR NOT NULL,
                        "fromCity" VARCHAR NOT NULL,
                        "toState" VARCHAR NOT NULL,
                        "toCity" VARCHAR NOT NULL,
                        "price" VARCHAR NOT NULL,
                        "seats" INTEGER NOT NULL,
                        "acceptedRequests" INTEGER,
                        "availableSeats" INTEGER,
                        "departureDate" DATE NOT NULL,
                        "departureTime" TIME NOT NULL,
                        "pickupLocation" VARCHAR NOT NULL,
                        "status" VARCHAR NOT NULL,
                        "userId" INTEGER REFERENCES "Users" (id) ON DELETE CASCADE,
                        "createdAt" DATE NOT NULL DEFAULT NOW(),
                        "updatedAt" DATE NOT NULL DEFAULT NOW())`)
                    .then(() => connectionPool.query(`CREATE TABLE IF NOT EXISTS "JoinRide" (
                                id SERIAL PRIMARY KEY,
                                "rideId" INTEGER REFERENCES "RideOffers" (id) ON DELETE CASCADE,
                                "userId" INTEGER REFERENCES "Users" (id) ON DELETE CASCADE,
                                "rideDepartureDate" DATE NOT NULL,
                                status VARCHAR NOT NULL,
                                "createdAt" DATE NOT NULL DEFAULT NOW(),
                                "updatedAt" DATE NOT NULL DEFAULT NOW())`)));
        });
};

export default Models;
