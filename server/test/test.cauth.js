import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.use(chaiHttp);
const { assert, should } = chai;
should();

describe('--- auth route testing ----', () => {
    /* describe('/auth/signup: POST: Sign up a user', () => {
        it('On success:: All good: Sign up successful', (done) => {
            chai
                .request(app)
                .post('/api/v1/auth/signup')
                .set('Accept', 'application/json')
                .send({
                    firstname: 'Babara',
                    lastname: 'Chai',
                    gender: 'Male',
                    email: 'baa@chai.com',
                    password: 'notess',
                    repassword: 'notess',
                    phone: '7564123578',
                    city: 'Anthony',
                    state: 'Lagos'
                })
                .end((req, res) => {
                    res.should.have.status(201);
                    assert.equal(res.body.status, 'success');
                    assert.isArray(res.body.data);
                    done();
                });
        });
    }); */
    describe('/auth/login: POST: User Login', () => {
        it('On error:: deny access', (done) => {
            chai
                .request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'ang@anla.com',
                    password: 'notess'
                })
                .end((req, res) => {
                    res.should.have.status(401);
                    assert.equal(res.body.status, 'fail');
                    assert.equal(res.body.data, 'access denied');
                    done();
                });
        });
        it('On success:: Log in user', (done) => {
            chai
                .request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'ang@andela.com',
                    password: 'notess'
                })
                .end((req, res) => {
                    const theCookie = res.header['set-cookie'];
                    res.should.have.status(200);
                    assert.equal(res.body.status, 'success');
                    done();

                    it('On error:: Ride not exist', () => {
                        chai
                            .request(app)
                            .get('/api/v1/auth/login')
                            .set('cookies', theCookie)
                            .end((req, res) => {
                                res.should.have.status(200);
                                assert.equal(res.body.status, 'success');
                                assert.equal(res.body.data, 'already logged in');
                                done();
                            });
                    });
                });
        });
        it('On success:: Logout user', (done) => {
            chai
                .request(app)
                .post('/api/v1/auth/logout')
                .send({})
                .end((req, res) => {
                    res.should.have.status(200);
                    assert.equal(res.body.status, 'success');
                    assert.equal(res.body.data, 'logged out');
                    done();
                });
        });
    });
});
