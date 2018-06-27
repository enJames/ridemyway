import connectionPool from './connectionPool';

// Create Users Table
connectionPool.query(`CREATE TABLE IF NOT EXISTS Users (
    id INTEGER PRIMARY KEY,
    firstname VARCHAR NOT NULL,
    lastname VARCHAR NOT NULL,
    email VARCHAR NOT NULL UNIQUE,
    password VARCHAR NOT NULL,
    gender VARCHAR NOT NULL,
    phone INTEGER NOT NULL UNIQUE,
    city INTEGER NOT NULL,
    state INTEGER NOT NULL)`, (err) => {
    if (err) {
        throw err;
    }
    console.log('Users table created successfully');
});

// Create Friends Table
connectionPool.query(`CREATE TABLE IF NOT EXISTS Friends (
    id INTEGER PRIMARY KEY,
    userId INTEGER REFERENCES "Users" (id) ON DELETE CASCADE,
    pal INTEGER REFERENCES "Users" (id) ON DELETE CASCADE,
    status VARCHAR NOT NULL)`, (err) => {
    console.log('RideOffers');
    if (err) {
        throw err;
    }
    console.log('Friends table created successfully');
});
