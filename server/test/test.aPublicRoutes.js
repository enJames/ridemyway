import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import connectionPool from '../models/connectionPool';
import seedData from '../models/seedData';

const { rideOffer } = seedData;

chai.use(chaiHttp);
const { assert, should } = chai;
should();

describe('--- Catch all routes ----', () => {
    describe('all routes', () => {
        it('On success:: send welcome message', (done) => {
            chai
                .request(app)
                .get('/')
                .end((req, res) => {
                    res.should.have.status(200);
                    assert.equal(res.body.message, 'Ride my way application by Enejo James Oche.');
                    done();
                });
        });
    });
});

describe('--- Rides route testing ----', () => {
    describe('/rides: GET', () => {
        before('create table "RideOffers"', (done) => {
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
                    rideOffer();
                    done();
                });
        })
        it('On success:: Get all ride offers', (done) => {
            chai
                .request(app)
                .get('/api/v1/rides')
                .end((req, res) => {
                    res.should.have.status(200);
                    assert.equal(res.body.status, 'success');
                    assert.isArray(res.body.data);
                    done();
                });
        });
    });
    describe('/rides/<rideId>: GET', () => {
        it('On success:: return a ride', (done) => {
            chai
                .request(app)
                .get('/api/v1/rides/1')
                .end((req, res) => {
                    res.should.have.status(200);
                    assert.equal(res.body.status, 'success');
                    assert.isObject(res.body.data);
                    done();
                });
        });
        it('On error:: incorrect id', (done) => {
            chai
                .request(app)
                .get('/api/v1/rides/5')
                .end((req, res) => {
                    res.should.have.status(404);
                    assert.equal(res.body.status, 'fail');
                    assert.equal(res.body.data, 'resource non-existent');
                    done();
                });
        });
        /*
        it('On error:: incorrect id', (done) => {
            chai
                .request(app)
                .get('/api/v1/rides/hey')
                .end((req, res) => {
                    res.should.have.status(401);
                    assert.equal(res.body.message, 'Invalid ride ID');
                    assert.exists(res.body.responseObject);
                    done();
                });
        });
        */
    });
});
