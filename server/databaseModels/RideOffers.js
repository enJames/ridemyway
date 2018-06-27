import connectionPool from './connectionPool';

// Create RideOffers Table
connectionPool.query(`CREATE TABLE IF NOT EXISTS RideOffers (
    id INTEGER SERIAL PRIMARY KEY,
    fromState VARCHAR NOT NULL,
    fromCity VARCHAR NOT NULL,
    toState VARCHAR NOT NULL,
    toCity VARCHAR NOT NULL,
    price VARCHAR NOT NULL,
    departureDate DATE NOT NULL,
    departureTime TIME NOT NULL,
    state VARCHAR NOT NULL,
    userId INTEGER REFERENCES "Users" (id) ON DELETE CASCADE)`, (err) => {
    if (err) {
        throw err;
    }
    console.log('RideOffers table created successfully');
});
