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
                    email: 'elton@jons.com',
                    password: 'notess',
                    repassword: 'notess'
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
                    email: '',
                    password: 'notess',
                    repassword: 'notess'
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
                    email: 'eltonjons.com',
                    password: 'notess',
                    repassword: 'notess'
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
                    email: 'elton@jons.com',
                    password: '',
                    repassword: 'notess'
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
                    email: 'elton@jons.com',
                    password: 'notes',
                    repassword: 'notess'
                })
                .end((req, res) => {
                    res.should.have.status(400);
                    expect(res.body.status).to.equal('fail');
                    assert.exists(res.body.message);
                    done();
                });
        });
    });

    describe('Login form validation', () => {
        it('On error:: fields not set: email, not set', (done) => {
            chai
                .request(app)
                .post('/api/v1/auth/signup')
                .send({
                    email: '',
                    password: 'notess'
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
                    email: 'eltonjons.com',
                    password: 'notess'
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
                    email: 'elton@jons.com',
                    password: ''
                })
                .end((req, res) => {
                    res.should.have.status(400);
                    expect(res.body.status).to.equal('fail');
                    assert.exists(res.body.message);
                    done();
                });
        });
    });

    describe('Login form validation', () => {
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
        it('On error:: fields not set: no fromState', (done) => {
            chai
                .request(app)
                .post('/api/v1/users/rides')
                .set('cookies', theCookie)
                .type('form')
                .send({
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
                    expect(res).to.have.status(400);
                    assert.equal(res.body.status, 'fail');
                    assert.equal(res.body.message, 'Current state is required');
                    done();
                });
        });
        it('On error:: fields not set: no fromCity', (done) => {
            chai
                .request(app)
                .post('/api/v1/users/rides')
                .set('cookies', theCookie)
                .type('form')
                .send({
                    fromState: 'Benue',
                    toState: 'Enugu',
                    toCity: 'Obolafor',
                    price: 800,
                    seats: 4,
                    departureDate: '2018-07-02',
                    departureTime: '10:00am',
                    pickupLocation: 'Ugbokolo Market'
                })
                .end((req, res) => {
                    expect(res).to.have.status(400);
                    assert.equal(res.body.status, 'fail');
                    assert.equal(res.body.message, 'Current city is required');
                    done();
                });
        });
        it('On error:: fields not set: no toState', (done) => {
            chai
                .request(app)
                .post('/api/v1/users/rides')
                .set('cookies', theCookie)
                .type('form')
                .send({
                    fromState: 'Benue',
                    fromCity: 'Ugbokolo',
                    toCity: 'Obolafor',
                    price: 800,
                    seats: 4,
                    departureDate: '2018-07-02',
                    departureTime: '10:00am',
                    pickupLocation: 'Ugbokolo Market'
                })
                .end((req, res) => {
                    expect(res).to.have.status(400);
                    assert.equal(res.body.status, 'fail');
                    assert.equal(res.body.message, 'Destination state is required');
                    done();
                });
        });
        it('On error:: fields not set: no toCity', (done) => {
            chai
                .request(app)
                .post('/api/v1/users/rides')
                .set('cookies', theCookie)
                .type('form')
                .send({
                    fromState: 'Benue',
                    fromCity: 'Ugbokolo',
                    toState: 'Enugu',
                    price: 800,
                    seats: 4,
                    departureDate: '2018-07-02',
                    departureTime: '10:00am',
                    pickupLocation: 'Ugbokolo Market'
                })
                .end((req, res) => {
                    expect(res).to.have.status(400);
                    assert.equal(res.body.status, 'fail');
                    assert.equal(res.body.message, 'Destination city is required');
                    done();
                });
        });
        it('On error:: fields not set: no price', (done) => {
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
                    seats: 4,
                    departureDate: '2018-07-02',
                    departureTime: '10:00am',
                    pickupLocation: 'Ugbokolo Market'
                })
                .end((req, res) => {
                    expect(res).to.have.status(400);
                    assert.equal(res.body.status, 'fail');
                    assert.equal(res.body.message, 'Enter a valid value for price');
                    done();
                });
        });
        it('On error:: fields not set: no seats', (done) => {
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
                    departureDate: '2018-07-02',
                    departureTime: '10:00am',
                    pickupLocation: 'Ugbokolo Market'
                })
                .end((req, res) => {
                    expect(res).to.have.status(400);
                    assert.equal(res.body.status, 'fail');
                    assert.equal(res.body.message, 'Enter a valid value for seats');
                    done();
                });
        });
        it('On error:: fields not set: no departureDate', (done) => {
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
                    departureDate: '',
                    departureTime: '10:00am',
                    pickupLocation: 'Ugbokolo Market'
                })
                .end((req, res) => {
                    expect(res).to.have.status(400);
                    assert.equal(res.body.status, 'fail');
                    assert.equal(res.body.message, 'Departure date is required');
                    done();
                });
        });
        it('On error:: users/rides: cannot create ride with date in the past', (done) => {
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
                    expect(res).to.have.status(405);
                    assert.equal(res.body.status, 'fail');
                    assert.equal(res.body.message, 'Departure is in the past or too sudden. Consider changing to a later date');
                    done();
                });
        });
        it('On error:: fields not set: no departureTime', (done) => {
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
                    pickupLocation: 'Ugbokolo Market'
                })
                .end((req, res) => {
                    expect(res).to.have.status(400);
                    assert.equal(res.body.status, 'fail');
                    assert.equal(res.body.message, 'Departure time is required');
                    done();
                });
        });
        it('On error:: fields not set: no pickupLocation', (done) => {
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
                })
                .end((req, res) => {
                    expect(res).to.have.status(400);
                    assert.equal(res.body.status, 'fail');
                    assert.equal(res.body.message, 'Pickup location is required');
                    done();
                });
        });
    });
});
