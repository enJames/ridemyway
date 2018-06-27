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
                    assert.equal(res.body.message, 'Found 3 ride offers');
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
                    assert.equal(res.body.message, 'Ride found');
                    assert.isObject(res.body.responseObject);
                    done();
                });
        });
        it('On error:: incorrect id', (done) => {
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
    });
    describe('/rides/<rideId>/requests: GET', () => {
        it('On error:: incorrect ride offer ID: Ride offer does not exist', (done) => {
            chai
                .request(app)
                .get('/api/v1/rides/10/requests')
                .end((req, res) => {
                    res.should.have.status(404);
                    assert.equal(res.body.message, 'Ride offer does not exist');
                    done();
                });
        });
        it('On error:: No join requests for ride offer', (done) => {
            chai
                .request(app)
                .get('/api/v1/rides/3/requests')
                .end((req, res) => {
                    res.should.have.status(404);
                    assert.equal(res.body.message, 'No join requests for this ride yet');
                    done();
                });
        });
        it('On success:: Get all join requests for a ride offer', (done) => {
            chai
                .request(app)
                .get('/api/v1/rides/1/requests')
                .end((req, res) => {
                    res.should.have.status(200);
                    assert.equal(res.body.message, 'Found 2 join requests for this ride offer');
                    assert.exists(res.body.responseObject);
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
                    fromCity: 'Rivers',
                    fromState: 'Rivers',
                    toCity: 'Imo',
                    toState: '',
                    price: 1500,
                    seats: 3,
                    userId: '1',
                    departureDate: '26/5/2018',
                    departureTime: '10:00am',
                    pickupLocation: 'Gbagada'
                })
                .end((req, res) => {
                    res.should.have.status(405);
                    assert.exists(res.body.errors);
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
                    fromCity: 'Rivers',
                    fromState: 'Rivers',
                    toCity: 'Imo',
                    toState: 'Rivers',
                    price: 1500,
                    seats: 3,
                    userId: '1',
                    departureDate: '26/5/2018',
                    departureTime: '10:00am',
                    pickupLocation: 'Gbagada'
                })
                .end((req, res) => {
                    res.should.have.status(201);
                    assert.equal(res.body.message, 'Ride offer created');
                    assert.exists(res.body.responseObject);
                    done();
                });
        });
    });
    describe('/rides/:rideId/requests: POST', () => {
        it('On error:: request without userId: User not recognised', (done) => {
            chai
                .request(app)
                .post('/api/v1/rides/1/requests')
                .send({
                    userId: ''
                })
                .end((req, res) => {
                    res.should.have.status(401);
                    assert.equal(res.body.message, 'User not recognised');
                    done();
                });
        });
        it('On error:: requst without userId: Ride offer does not exist', (done) => {
            chai
                .request(app)
                .post('/api/v1/rides/5/requests')
                .send({
                    userId: 1
                })
                .end((req, res) => {
                    res.should.have.status(404);
                    assert.equal(res.body.message, 'Ride offer does not exist');
                    done();
                });
        });
        it('On success:: Create a join request', (done) => {
            chai
                .request(app)
                .post('/api/v1/rides/1/requests')
                .send({
                    userId: 1
                })
                .end((req, res) => {
                    res.should.have.status(201);
                    assert.equal(res.body.message, 'Your request has been created');
                    assert.exists(res.body.responseObject);
                    done();
                });
        });
        it('On success:: Create a join request', (done) => {
            chai
                .request(app)
                .post('/api/v1/rides/hey/requests')
                .send({
                    userId: 1
                })
                .end((req, res) => {
                    res.should.have.status(401);
                    assert.equal(res.body.message, 'Invalid ride ID');
                    assert.exists(res.body.responseObject);
                    done();
                });
        });
    });
});
