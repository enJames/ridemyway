import connectionPool from './connectionPool';

// Create Friends Table
connectionPool.query(`CREATE TABLE IF NOT EXISTS Friends (
    id INTEGER SERIAL PRIMARY KEY,
    userId INTEGER REFERENCES "Users" (id) ON DELETE CASCADE,
    pal INTEGER REFERENCES "Users" (id) ON DELETE CASCADE,
    status VARCHAR NOT NULL)`, (err) => {
    console.log('RideOffers');
    if (err) {
        throw err;
    }
    console.log('Friends table created successfully');
});
