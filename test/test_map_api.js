const chai = require('chai');
const server = require('../app');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const db = require('../models');
const bcrypt = require('bcrypt');

chai.use(chaiHttp);
let agent = chai.request.agent(server);

const apiUrl = '/api/maps/';
const userPassword = 'tester';

let user;

// @CLEANUP move to test utils file
function createUser (username) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(userPassword, 8, (err, hash) => {
      db.user.create({
        first_name: 'John',
        last_name: 'Doe',
        username: username,
        password: hash,
        role: 'user',
        is_active: true
      })
        .then((user) => resolve(user))
        .catch((err) => reject(err));
    });
  });
}

before((done) => {
  createUser('tester')
    .then((obj) => {
      user = obj;
      agent
        .post('/login')
        .send({
          username: obj.username,
          password: userPassword
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
    });
});

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
      agent
        .post(apiUrl)
        .send(mapData)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          assertMapDetails(res.body);

          db.map.count().then(c => {
            expect(c).to.equal(1);
            db.map.destroy({where: {id: mapData.id}});
            done();
          });
        });
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
      agent
        .get(apiUrl + '?public=true')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.length).to.equal(1);

          let map = res.body[0];
          assertMapDetails(map);
          done();
        });
    });

    it('filters the list of maps', (done) => {
      let newMapData = {
        id: 2,
        name: 'New map',
        public: false,
        userId: user.id
      };
      db.map.create(newMapData)
        .then((newMap) => {
          agent
            .get(apiUrl)
            .end((err, res) => {
              expect(res.status).to.equal(200);
              expect(res.body.length).to.equal(1);

              let map = res.body[0];
              expect(map.userId).to.equal(user.id);
              expect(map.id).to.equal(newMap.id);

              db.map.count().then(c => {
                expect(c).to.equal(2);
                newMap.destroy().then(() => done());
              });
            });
        });
    });

    it('gets details of one map', (done) => {
      agent
        .get(apiUrl + '1')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          assertMapDetails(res.body);
          done();
        });
    });

    it('rejects viewing details of private not-owned map', (done) => {
      createUser('other')
        .then((newUser) => {
          let newMapData = {
            id: 2,
            name: 'New map',
            public: false,
            userId: newUser.id
          };
          db.map.create(newMapData)
            .then((newMap) => {
              agent
                .get(apiUrl + '2')
                .end((err, res) => {
                  expect(res.status).to.equal(403);
                  newMap.destroy()
                    .then(() => newUser.destroy())
                    .then(() => done());
                });
            });
        });
    });

    it('updates a map', (done) => {
      let newMapData = {
        name: 'New map',
        public: false
      };

      agent
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
      agent
        .delete(apiUrl + '1')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          db.map.count().then(c => {
            expect(c).to.equal(0);
            done();
          });
        });
    });
  });
});
