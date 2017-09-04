const chai = require('chai');
const server = require('../app');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const db = require('../models');

chai.use(chaiHttp);

const apiUrl = '/api/maps/';

describe('Test Maps API endpoint', () => {
  let mapData = {
    id: 1,
    name: 'Test map',
    public: true
  };

  function assertMapDetails (map) {
    expect(map.name).to.equal(mapData.name);
    expect(map.public).to.equal(mapData.public);
  };

  describe('Test creating a map', () => {
    it('creates a map', (done) => {
      chai.request(server)
        .post(apiUrl)
        .send(mapData)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          assertMapDetails(res.body);
        });

      db.map.count().then(c => expect(c).to.equal(1));
      db.map.destroy({where: {id: mapData.id}});
      done();
    });
  });

  describe('Test RUD operations', () => {
    beforeEach((done) => {
      db.map.create(mapData);
      done();
    });
    afterEach((done) => {
      db.map.destroy({where: {id: mapData.id}});
      done();
    });

    it('gets the list of maps', (done) => {
      chai.request(server)
        .get(apiUrl)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.length).to.equal(1);

          let map = res.body[0];
          assertMapDetails(map);
          done();
        });
    });

    it('gets details of one map', (done) => {
      chai.request(server)
        .get(apiUrl + '1')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          assertMapDetails(res.body);
          done();
        });
    });

    it('updates a map', (done) => {
      let newMapData = {
        name: 'New map',
        public: false
      };

      chai.request(server)
        .put(apiUrl + '1')
        .send(newMapData)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          db.map.findById(1).then((map) => {
            expect(map.name).to.equal(newMapData.name);
            expect(map.public).to.equal(newMapData.public);
            done();
          });
        });
    });

    it('deletes a map', (done) => {
      chai.request(server)
        .delete(apiUrl + '1')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          db.map.count().then(c => expect(c).to.equal(0));
          done();
        });
    });
  });
});
