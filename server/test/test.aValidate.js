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
                    gender: 'Male',
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
});
