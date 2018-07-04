import connectionPool from './connectionPool';

const seedData = {
    user: () => {
        connectionPool.query(`INSERT INTO "Users" (
            "firstname", "lastname", "email", "password", "gender", "phone", "city", "state")
            VALUES ('King', 'Enejo', 'king@enejo.com', '$2b$10$9QUNmT5vutFmkny6Cv3m4.eTF4VMPVKk2iuA1iIhdDjBnl27X/C9i',
                'Male', '080545669871', 'Gbagada', 'Lagos'),
                ('Angela', 'Nicole', 'ang@nicole.com', '$2b$10$pygQvbU1519KmgdqZtxTmOmcyCePjld8CHRTg8LzU29bzhcN1IxAy',
                    'Female', '080455669871', 'Ibadan', 'Oyo'),
                ('Nneka', 'John', 'nne@john.com', '$2b$10$TLnhzF7UZ8lo41kuUr0wquYcq7aci83qFouxWUq7S7hZTdsJvT6lW',
                    'Female', '080455000871', 'Owerri', 'Imo')`);
    },
    rideOffer: () => {
        connectionPool.query(`INSERT INTO "RideOffers" (
                "fromState", "fromCity", "toState", "toCity", "price", "seats", "departureDate", "departureTime", "pickupLocation", "userId")
            VALUES
                ('Benue', 'Ugbokolo', 'Enugu', 'Obolafor', 800, 4, '2018-07-02', '10:00am', 'Ugbokolo Market', 1),
                ('Oyo', 'Ibadan', 'Osun', 'Oshogbo', 2800, 4, '2018-07-03', '9:00am', 'Challenge', 2)`);
    },
    joinRide: () => {
        connectionPool.query(`INSERT INTO "JoinRide" ("rideId", "userId", "status")
            VALUES (2, 3, 'accepted')`);
    }
};

export default seedData;
