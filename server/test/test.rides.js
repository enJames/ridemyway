import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.use(chaiHttp);
const { assert, should } = chai;
should();

describe('--- Rides route testing ----', () => {
    describe('/rides: Get all rides', () => {
        it('On success:: return all rides', (done) => {
            chai
                .request(app)
                .get('/api/v1/rides')
                .end((req, res) => {
                    res.should.have.status(200);
                    assert.equal(res.body.message, 'Found 2 ride offers');
                    assert.equal(res.status, 200);
                    done();
                });
        });
    });
});
