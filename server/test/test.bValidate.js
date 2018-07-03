import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

process.env.NODE_ENV = 'test';

chai.use(chaiHttp);
const { assert, should, expect } = chai;
should();

describe('Validation tests', () => {
    describe('signup form validation', () => {
        it('On error:: fields not set', (done) => {
            chai
                .request(app)
                .post('/api/v1/auth/signup')
                .send({
                    firstname: '',
                    lastname: '',
                    gender: '',
                    email: '',
                    password: '',
                    repassword: '',
                    phone: '',
                    city: '',
                    state: ''
                })
                .end((req, res) => {
                    res.should.have.status(400);
                    expect(res.body.status).to.equal('fail');
                    assert.exists(res.body.errors);
                    done();
                });
        });
    });
});
