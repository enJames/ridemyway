import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.use(chaiHttp);
const { assert, should } = chai;
should();

describe('--- Users route testing ----', () => {
    describe('/auth/signup: POST: Sign up a user', () => {
        it('On error:: fields not set', (done) => {
            chai
                .request(app)
                .post('/api/v1/auth/signup')
                .send({
                    firstname: 'Babara',
                    lastname: 'Chai',
                    gender: 'Male',
                    email: 'babara@chai.com',
                    password: 'pass',
                    repassword: 'pass',
                    phone: '08034036001',
                    city: '',
                    state: 'Lagos'
                })
                .end((req, res) => {
                    res.should.have.status(405);
                    assert.exists(res.body.errors);
                    done();
                });
        });
        it('On error:: retyped password mismatch: Passwords do not match', (done) => {
            chai
                .request(app)
                .post('/api/v1/auth/signup')
                .send({
                    firstname: 'Babara',
                    lastname: 'Chai',
                    gender: 'Male',
                    email: 'babara@chai.com',
                    password: 'pass',
                    repassword: 'passes',
                    phone: '08034036001',
                    city: 'Gbagada',
                    state: 'Lagos'
                })
                .end((req, res) => {
                    res.should.have.status(405);
                    assert.exists(res.body.errors);
                    done();
                });
        });
        it('On success:: All good: Password less than 6 characters', (done) => {
            chai
                .request(app)
                .post('/api/v1/auth/signup')
                .send({
                    firstname: 'Babara',
                    lastname: 'Chai',
                    gender: 'Male',
                    email: 'babara@chai.com',
                    password: 'pass',
                    repassword: 'pass',
                    phone: '08034036001',
                    city: 'Gbagada',
                    state: 'Lagos'
                })
                .end((req, res) => {
                    res.should.have.status(405);
                    assert.exists(res.body.errors);
                    done();
                });
        });
        it('On success:: All good: Sign up successful', (done) => {
            chai
                .request(app)
                .post('/api/v1/auth/signup')
                .send({
                    firstname: 'Babara',
                    lastname: 'Chai',
                    gender: 'Male',
                    email: 'babara@chai.com',
                    password: 'passes',
                    repassword: 'passes',
                    phone: '08034036001',
                    city: 'Gbagada',
                    state: 'Lagos'
                })
                .end((req, res) => {
                    res.should.have.status(201);
                    assert.equal(res.body.message, 'Sign up successful');
                    assert.exists(res.body.responseObject);
                    done();
                });
        });
    });
    describe('/auth/login: POST: Login user', () => {
        it('On error:: fields not set: Please fill out all fields', (done) => {
            chai
                .request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'ajan@airbnb.com',
                    password: ''
                })
                .end((req, res) => {
                    res.should.have.status(405);
                    assert.exists(res.body.errors);
                    done();
                });
        });
        it('On error:: fields not set: Credentials do not match', (done) => {
            chai
                .request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'aja@airbnb.com',
                    password: 'pass'
                })
                .end((req, res) => {
                    res.should.have.status(401);
                    assert.equal(res.body.message, 'Credentials do not match');
                    done();
                });
        });
        it('On success:: All good: Login successful', (done) => {
            chai
                .request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'ajan@airbnb.com',
                    password: 'pass'
                })
                .end((req, res) => {
                    res.should.have.status(200);
                    assert.equal(res.body.message, 'You are logged in');
                    done();
                });
        });
    });
});
