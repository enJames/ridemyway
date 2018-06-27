import connectionPool from './connectionPool';

// Create JoinRide Table
connectionPool.query(`CREATE TABLE IF NOT EXISTS JoinRide (
    id INTEGER SERIAL PRIMARY KEY,
    rideId INTEGER REFERENCES "RideOffers" (id) ON DELETE CASCADE,
    userId INTEGER REFERENCES "Users" (id) ON DELETE CASCADE,
    status VARCHAR NOT NULL)`, (err) => {
        console.log('RideOffers');
    if (err) {
        throw err;
    }
    console.log('JoinRide table created successfully');
});
