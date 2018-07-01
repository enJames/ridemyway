import chai from 'chai';
import chaiHttp from 'chai-http';
import cookieParser from 'cookie-parser';
import app from '../app';

chai.use(chaiHttp);
chai.use(cookieParser);
const { assert, should, expect } = chai;
should();

describe('Logged in category', () => {
    describe('View all requests', () => {
        it('Log user in', (done) => {
            chai
                .request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'king@enejo.com',
                    password: 'notess'
                })
                .end((req, res) => {
                    const theCookie = res.header['set-cookie'];
                    expect(res).to.have.status(200);
                    assert.equal(res.body.status, 'success');
                    done();

                    it('On error:: Ride not exist', () => {
                        chai
                            .request(app)
                            .get('/api/v1/users/rides/10/requests')
                            .set('cookies', theCookie)
                            .end((req, res) => {
                                expect(res).to.have.status(404);
                                assert.equal(res.body.status, 'fail');
                                done();
                            });
                    });
                    it('On success:: Ride exists, requests exist', () => {
                        chai
                            .request(app)
                            .get('/api/v1/users/rides/1/requests')
                            .set('cookies', theCookie)
                            .end((req, res) => {
                                expect(res).to.have.status(200);
                                assert.equal(res.body.status, 'success');
                                done();
                            });
                    });
                    it('On success:: Make a join ride request: friends', () => {
                        chai
                            .request(app)
                            .post('/api/v1//rides/:rideId/requests')
                            .send({})
                            .set('cookies', theCookie)
                            .end((req, res) => {
                                expect(res).to.have.status(201);
                                assert.equal(res.body.status, 'success');
                                assert.equal(res.body.data, 'Your join request has been processed and its pending Marcelo\'s response');
                                done();
                            });
                    });
                });
        });
    });
    describe('View all requests: No requests yet', () => {
        it('Log user in', (done) => {
            chai
                .request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'king@enejo.com',
                    password: 'notess'
                })
                .end((req, res) => {
                    const theCookie = res.header['set-cookie'];
                    expect(res).to.have.status(200);
                    assert.equal(res.body.status, 'success');
                    done();

                    it('On error:: Ride exist, no request', () => {
                        chai
                            .request(app)
                            .get('/api/v1/users/rides/10/requests')
                            .set('cookies', theCookie)
                            .end((req, res) => {
                                expect(res).to.have.status(404);
                                assert.equal(res.body.status, 'fail');
                                done();
                            });
                    });
                    it('On success:: Ride exists, requests exist', () => {
                        chai
                            .request(app)
                            .get('/api/v1/users/rides/1/requests')
                            .set('cookies', theCookie)
                            .end((req, res) => {
                                expect(res).to.have.status(200);
                                assert.equal(res.body.status, 'success');
                                done();
                            });
                    });
                });
        });
    });
});
