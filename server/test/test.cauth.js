import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

process.env.NODE_ENV = 'test';

chai.use(chaiHttp);
const { assert, should } = chai;
should();


describe('--- auth route testing ----', () => {
    /*
    describe('/auth/signup: POST: Sign up a user', () => {
        it('On success:: All good: Sign up successful', (done) => {
            chai
                .request(app)
                .post('/api/v1/auth/signup')
                .set('Accept', 'application/json')
                .send({
                    firstname: 'Sohn',
                    lastname: 'Clohn',
                    gender: 'Male',
                    email: 'sohn@clohn.com',
                    password: 'notess',
                    repassword: 'notess',
                    phone: '75264230001',
                    city: 'Iklinaku',
                    state: 'Cross River'
                })
                .end((req, res) => {
                    res.should.have.status(201);
                    assert.equal(res.body.status, 'success');
                    assert.equal(res.body.data, null);
                    done();
                });
        });
    }); */
    describe('/auth/login: POST: User Login', () => {
        // let theCookie;
        //
        // before((done) => {
        //     chai
        //         .request(app)
        //         .post('/api/v1/auth/login')
        //         .send({
        //             email: 'king@enejo.com',
        //             password: 'notess'
        //         })
        //         .type('form')
        //         .end((req, res) => {
        //             theCookie = res.header['set-cookie'];
        //             res.should.have.status(200);
        //             assert.equal(res.body.status, 'success');
        //             done();
        //         });
        // });
        it('On error:: deny access', (done) => {
            chai
                .request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'king@enjo.com',
                    password: 'notess'
                })
                .end((req, res) => {
                    res.should.have.status(401);
                    assert.equal(res.body.status, 'fail');
                    assert.equal(res.body.message, 'Email or password incorrect');
                    assert.equal(res.body.data, null);
                    done();
                });
        });
        it('On success:: Log in user.', (done) => {
            chai
                .request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'king@enejo.com',
                    password: 'notess'
                })
                .end((req, res) => {
                    res.should.have.status(200);
                    assert.equal(res.body.status, 'success');
                    done();
                });
        });
    });
});
