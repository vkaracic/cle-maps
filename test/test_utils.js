const permissions = require('../utils/permissions');
const chai = require('chai');
const spies = require('chai-spies');
const expect = chai.expect;

chai.use(spies);

describe('Test permissions', function () {
  // @CLEANUP: move the req and res mocks to a common mock file.
  IsAuthenticatedReqMock = function (isAuth, originalUrl) {
    this.isAuthenticated = function () {
      return isAuth;
    }

    this.originalUrl = originalUrl;
  }

  ResMock = function (expectedUrl) {
    this.redirect = function (url) {
      expect(expectedUrl).to.equal(url);
    };
  }

  it('should call next if authenticated', (done) => {
    let authenticatedReqMock = new IsAuthenticatedReqMock(true);
    let spy = chai.spy();

    permissions.isAuthenticated(authenticatedReqMock, null, spy);
    expect(spy).to.have.been.called();
    done();
  });

  it('should redirect to login if not authenticated', (done) => {
    let originalUrl = 'nextUrl';
    let notAuthenticatedReqMock = new IsAuthenticatedReqMock(false, originalUrl);
    let notAuthenticatedResMock = new ResMock('/login/?next=' + originalUrl);

    permissions.isAuthenticated(notAuthenticatedReqMock, notAuthenticatedResMock);
    done();
  });
});
