import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

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
        it('On success:: Get all ride offers', (done) => {
            chai
                .request(app)
                .get('/api/v1/rides')
                .end((req, res) => {
                    res.should.have.status(200);
                    assert.equal(res.body.message, 'Found 2 ride offers');
                    done();
                });
        });
    });
    describe('/rides/<rideId>: GET', () => {
        it('On success:: Get a specific ride offer', (done) => {
            chai
                .request(app)
                .get('/api/v1/rides/1')
                .end((req, res) => {
                    res.should.have.status(200);
                    assert.equal(res.body.message, 'Ride found');
                    assert.isObject(res.body.responseObject);
                    done();
                });
        });
        it('On error:: Ride not found', (done) => {
            chai
                .request(app)
                .get('/api/v1/rides/5')
                .end((req, res) => {
                    res.should.have.status(404);
                    assert.equal(res.body.message, 'Ride not found');
                    assert.notExists(res.body.responseObject);
                    done();
                });
        });
    });
    describe('/rides: POST', () => {
        it('On error:: Send error feedback: Please fill out all fields', (done) => {
            chai
                .request(app)
                .post('/api/v1/rides')
                .send({
                    from: 'Rivers',
                    to: 'Imo',
                    price: '',
                    seatsShared: 3,
                    seatsAvailable: 1,
                    driver: 'Ajaniki Travis-Ci'
                })
                .end((req, res) => {
                    res.should.have.status(201);
                    assert.equal(res.body.message, 'Please fill out all fields');
                    done();
                });
        });
    });
    describe('/rides: POST', () => {
        it('On success:: Create a ride offer', (done) => {
            chai
                .request(app)
                .post('/api/v1/rides')
                .send({
                    from: 'Rivers',
                    to: 'Imo',
                    price: 1500,
                    seatsShared: 3,
                    seatsAvailable: 1,
                    driver: 'Ajaniki Travis-Ci'
                })
                .end((req, res) => {
                    res.should.have.status(201);
                    assert.equal(res.body.message, 'Ride offer created');
                    assert.exists(res.body.responseObject);
                    done();
                });
        });
    });
});
