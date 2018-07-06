import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

process.env.NODE_ENV = 'test';

chai.use(chaiHttp);
const { assert, should, expect } = chai;
should();

describe('Validation tests', () => {
    describe('signup form validation', () => {
        it('On error:: fields not set: firstname', (done) => {
            chai
                .request(app)
                .post('/api/v1/auth/signup')
                .send({
                    firstname: ' ',
                    lastname: 'Jons',
                    gender: 'Male',
                    email: 'elton@jons.com',
                    password: 'notess',
                    repassword: 'notess',
                    phone: '080643197845',
                    city: 'AfineCity',
                    state: 'AFineState'
                })
                .end((req, res) => {
                    res.should.have.status(400);
                    expect(res.body.status).to.equal('fail');
                    assert.exists(res.body.message);
                    done();
                });
        });
        it('On error:: fields not set: lastname', (done) => {
            chai
                .request(app)
                .post('/api/v1/auth/signup')
                .send({
                    firstname: 'Elton',
                    lastname: '',
                    gender: 'Male',
                    email: 'elton@jons.com',
                    password: 'notess',
                    repassword: 'notess',
                    phone: '080643197845',
                    city: 'AfineCity',
                    state: 'AFineState'
                })
                .end((req, res) => {
                    res.should.have.status(400);
                    expect(res.body.status).to.equal('fail');
                    assert.exists(res.body.message);
                    done();
                });
        });
        it('On error:: fields not set: gender', (done) => {
            chai
                .request(app)
                .post('/api/v1/auth/signup')
                .send({
                    firstname: 'Elton',
                    lastname: 'Jons',
                    gender: '',
                    email: 'elton@jons.com',
                    password: 'notess',
                    repassword: 'notess',
                    phone: '080643197845',
                    city: 'AfineCity',
                    state: 'AFineState'
                })
                .end((req, res) => {
                    res.should.have.status(400);
                    expect(res.body.status).to.equal('fail');
                    assert.exists(res.body.message);
                    done();
                });
        });
        it('On error:: fields not set: email no @', (done) => {
            chai
                .request(app)
                .post('/api/v1/auth/signup')
                .send({
                    firstname: 'Elton',
                    lastname: 'Jons',
                    gender: 'Male',
                    email: 'eltonjons.com',
                    password: 'notess',
                    repassword: 'notess',
                    phone: '080643197845',
                    city: 'AfineCity',
                    state: 'AFineState'
                })
                .end((req, res) => {
                    res.should.have.status(400);
                    expect(res.body.status).to.equal('fail');
                    assert.exists(res.body.message);
                    done();
                });
        });
        it('On error:: fields not set: email, not set', (done) => {
            chai
                .request(app)
                .post('/api/v1/auth/signup')
                .send({
                    firstname: 'Elton',
                    lastname: 'Jons',
                    gender: 'Male',
                    email: '',
                    password: 'notess',
                    repassword: 'notess',
                    phone: '080643197845',
                    city: 'AfineCity',
                    state: 'AFineState'
                })
                .end((req, res) => {
                    res.should.have.status(400);
                    expect(res.body.status).to.equal('fail');
                    assert.exists(res.body.message);
                    done();
                });
        });
        it('On error:: fields not set: password, not set', (done) => {
            chai
                .request(app)
                .post('/api/v1/auth/signup')
                .send({
                    firstname: 'Elton',
                    lastname: 'Jons',
                    gender: 'Male',
                    email: 'elton@jons.com',
                    password: '',
                    repassword: 'notess',
                    phone: '080643197845',
                    city: 'AfineCity',
                    state: 'AFineState'
                })
                .end((req, res) => {
                    res.should.have.status(400);
                    expect(res.body.status).to.equal('fail');
                    assert.exists(res.body.message);
                    done();
                });
        });
        it('On error:: fields not set: password, do no match', (done) => {
            chai
                .request(app)
                .post('/api/v1/auth/signup')
                .send({
                    firstname: 'Elton',
                    lastname: 'Jons',
                    gender: 'Male',
                    email: 'elton@jons.com',
                    password: 'notes',
                    repassword: 'notess',
                    phone: '080643197845',
                    city: 'AfineCity',
                    state: 'AFineState'
                })
                .end((req, res) => {
                    res.should.have.status(400);
                    expect(res.body.status).to.equal('fail');
                    assert.exists(res.body.message);
                    done();
                });
        });
        it('On error:: fields not set: phone number, contains alphabets', (done) => {
            chai
                .request(app)
                .post('/api/v1/auth/signup')
                .send({
                    firstname: 'Elton',
                    lastname: 'Jons',
                    gender: 'Male',
                    email: 'elton@jons.com',
                    password: 'notes',
                    repassword: 'notess',
                    phone: '0806431978yu45',
                    city: 'AfineCity',
                    state: 'AFineState'
                })
                .end((req, res) => {
                    res.should.have.status(400);
                    expect(res.body.status).to.equal('fail');
                    assert.exists(res.body.message);
                    done();
                });
        });
        it('On error:: fields not set: phone number, not set', (done) => {
            chai
                .request(app)
                .post('/api/v1/auth/signup')
                .send({
                    firstname: 'Elton',
                    lastname: 'Jons',
                    gender: 'Male',
                    email: 'elton@jons.com',
                    password: 'notes',
                    repassword: 'notess',
                    phone: '',
                    city: 'AfineCity',
                    state: 'AFineState'
                })
                .end((req, res) => {
                    res.should.have.status(400);
                    expect(res.body.status).to.equal('fail');
                    assert.exists(res.body.message);
                    done();
                });
        });
        it('On error:: fields not set: city, not set', (done) => {
            chai
                .request(app)
                .post('/api/v1/auth/signup')
                .send({
                    firstname: 'Elton',
                    lastname: 'Jons',
                    gender: 'Male',
                    email: 'elton@jons.com',
                    password: 'notes',
                    repassword: 'notess',
                    phone: '0806431978yu45',
                    city: '',
                    state: 'AFineState'
                })
                .end((req, res) => {
                    res.should.have.status(400);
                    expect(res.body.status).to.equal('fail');
                    assert.exists(res.body.message);
                    done();
                });
        });
        it('On error:: fields not set: state, not set', (done) => {
            chai
                .request(app)
                .post('/api/v1/auth/signup')
                .send({
                    firstname: 'Elton',
                    lastname: 'Jons',
                    gender: 'Male',
                    email: 'elton@jons.com',
                    password: 'notes',
                    repassword: 'notess',
                    phone: '0806431978yu45',
                    city: 'AfineCity',
                    state: ''
                })
                .end((req, res) => {
                    res.should.have.status(400);
                    expect(res.body.status).to.equal('fail');
                    assert.exists(res.body.message);
                    done();
                });
        });
    });
});
