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
    describe('/rides: Get all ride offers', () => {
        it('On success:: return all rides', (done) => {
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
    describe('/rides/<rideId>: Get a specific ride offer', () => {
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
    });
});
