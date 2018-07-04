import chai from 'chai';
import chaiHttp from 'chai-http';
import cookieParser from 'cookie-parser';
import app from '../app';

process.env.NODE_ENV = 'test';

chai.use(chaiHttp);
chai.use(cookieParser);
const { assert, should, expect } = chai;
should();

describe('Logged in category', () => {
    describe('View all requests', () => {
        let theCookie;

        before((done) => {
            chai
                .request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'king@enejo.com',
                    password: 'notess'
                })
                .end((req, res) => {
                    theCookie = res.header['set-cookie'];
                    res.should.have.status(200);
                    assert.equal(res.body.status, 'success');
                    done();
                });
        });
        it('On success:: create ride: users/rides', (done) => {
            chai
                .request(app)
                .post('/api/v1/users/rides')
                .set('cookies', theCookie)
                .type('form')
                .send({
                    fromState: 'Benue',
                    fromCity: 'Ugbokolo',
                    toState: 'Enugu',
                    toCity: 'Obolafor',
                    price: 800,
                    seats: 4,
                    departureDate: '2018-07-02',
                    departureTime: '10:00am',
                    pickupLocation: 'Ugbokolo Market'
                })
                .end((req, res) => {
                    expect(res).to.have.status(201);
                    assert.equal(res.body.status, 'success');
                    done();
                });
        });
        it('On error:: Ride not exist: users/rides/110/requests', (done) => {
            chai
                .request(app)
                .get('/api/v1/users/rides/110/requests')
                .set('cookies', theCookie)
                .end((req, res) => {
                    expect(res).to.have.status(404);
                    assert.equal(res.body.status, 'fail');
                    done();
                });
        });
        it('On success:: users/rides/1/requests: accessing a ride you do not own should fail', (done) => {
            chai
                .request(app)
                .get('/api/v1/users/rides/2/requests')
                .set('cookies', theCookie)
                .end((req, res) => {
                    expect(res).to.have.status(405);
                    assert.equal(res.body.status, 'fail');
                    done();
                });
        });
        it('On success:: Make a join ride request with wrong ride id should fail', (done) => {
            chai
                .request(app)
                .post('/api/v1/rides/wrongId/requests')
                .send({})
                .set('cookies', theCookie)
                .end((req, res) => {
                    expect(res).to.have.status(400);
                    assert.equal(res.body.status, 'fail');
                    assert.equal(res.body.message, 'ride id not recognised');
                    done();
                });
        });
        it('On success:: Make a join ride request: already joined', (done) => {
            chai
                .request(app)
                .post('/api/v1/rides/2/requests')
                .send({})
                .set('cookies', theCookie)
                .end((req, res) => {
                    expect(res).to.have.status(405);
                    assert.equal(res.body.status, 'fail');
                    assert.equal(res.body.message, 'You already joined this ride');
                    done();
                });
        });
        it('On error:: users/rides/3/requests: Ride exists, no requests', (done) => {
            chai
                .request(app)
                .get('/api/v1/users/rides/3/requests')
                .set('cookies', theCookie)
                .end((req, res) => {
                    expect(res).to.have.status(404);
                    assert.equal(res.body.status, 'fail');
                    assert.equal(res.body.message, 'No requests for this ride yet');
                    done();
                });
        });
        it('On error:: rides/1/requests: cannot join own ride', (done) => {
            chai
                .request(app)
                .post('/api/v1/rides/1/requests')
                .set('cookies', theCookie)
                .end((req, res) => {
                    expect(res).to.have.status(405);
                    assert.equal(res.body.status, 'fail');
                    assert.equal(res.body.message, 'You cannot join your own ride');
                    done();
                });
        });
    });
});
