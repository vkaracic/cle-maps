const chai = require('chai');
const expect = chai.expect;
const controller = require('../controllers');
const config = require('../config');

function MockRes (expected) {
  this.expected = expected;
  this.render = function (tplName, context) {
    expect(this.expected.tplName).to.equal(tplName);
    expect(this.expected.context).to.deep.equal(context);
  };
  this.redirect = function (url) {
    expect(this.expected.redirectUrl).to.equal(url);
  }
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
  })
});
