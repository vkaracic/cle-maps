const chai = require('chai');
const expect = chai.expect;
const controller = require('../controllers');
const config = require('../config');
const db = require('../models');

function MockRes (expected) {
  this.expected = expected;

  this.render = function (tplName, context) {
    expect(this.expected.tplName).to.equal(tplName);
    expect(this.expected.context).to.deep.equal(context);
  };
  this.redirect = function (url) {
    expect(this.expected.redirectUrl).to.equal(url);
  };
  this.setStatus = function (status) {
    expect(this.expected.status).to.equal(status);
  };
}

function MockReq (isAuthenticated, body) {
  this.body = body;

  this.isAuthenticated = function () {
    return isAuthenticated;
  };
}

describe('Test controllers', () => {
  it('renders index', (done) => {
    let indexResMock = new MockRes({
      tplName: 'index',
      context: {title: 'Index'}
    });
    controller.index(null, indexResMock);
    done();
  });

  it('renders creator page', (done) => {
    let creatorResMock = new MockRes({
      tplName: 'creator',
      context: {apiKey: config.mapsApiKey}
    });

    controller.creator(null, creatorResMock);
    done();
  });

  it('renders creatorSaveMap page', (done) => {
    let mapId = 1;
    let creatorSaveMapResMock = new MockRes({
      tplName: 'creator',
      context: {mapId: 1, apiKey: config.mapsApiKey}
    });

    controller.creatorSavedMap({params: {id: mapId}}, creatorSaveMapResMock);
    done();
  });

  it('renders registration page', (done) => {
    let req = new MockReq(false);
    let registrationResMock = new MockRes({
      tplName: 'register'
    });

    controller.registerView(req, registrationResMock);
    done();
  });

  it('redirects to index', (done) => {
    let req = new MockReq(true);
    let registrationResMock = new MockRes({
      redirectUrl: '/'
    });

    controller.registerView(req, registrationResMock);
    done();
  });

  describe('Registers a new user', () => {
    let userData = {
      username: 'Test User',
      first_name: 'John',
      last_name: 'Doe',
      password: 'password',
      role: 'user',
      is_active: 'true'
    };

    afterEach((done) => {
      db.user.destroy({where: {username: userData.username}});
      done();
    });

    it('registers a new user', (done) => {
      let req = new MockReq(null, userData);
      let regResMock = new MockRes({redirectUrl: '/login'});

      controller.registerUser(req, regResMock);
      done();
    });

    it('rejects user creation because of duplicate username', (done) => {
      let req = new MockReq(null, userData);
      let res = new MockRes({status: 400});

      db.user.create(userData).then(() => {
        controller.registerUser(req, res);
        done();
      });
    });
  });

  it('renders login page', (done) => {
    let req = new MockReq(false);
    let loginResMock = new MockRes({
      tplName: 'login'
    });

    controller.loginView(req, loginResMock);
    done();
  });

  it('redirects to index', (done) => {
    let req = new MockReq(true);
    let loginResMock = new MockRes({
      redirectUrl: '/'
    });

    controller.loginView(req, loginResMock);
    done();
  });
});
