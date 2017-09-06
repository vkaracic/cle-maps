const db = require('../models');
const expect = require('chai').expect;

describe('Test models', () => {
  let map;

  beforeEach((done) => {
    db.map.create().then(thisMap => {
      map = thisMap;
      done();
    });
  });
  afterEach((done) => {
    map = null;
    db.map.destroy({where: {id: 1}}).then(done());
  });

  it('adds markers', (done) => {
    let markerData = {
      id: 1,
      placeId: 'PlaceA',
      name: 'test',
      lat: 0,
      lng: 0,
      mapId: map.id
    };

    map.addMarkers([markerData]).then((map) => {
      db.marker.count().then(c => expect(c).to.equal(1));
      db.marker.findById(1).then(marker => {
        expect(marker.placeId).to.equal(markerData.placeId);
        expect(marker.name).to.equal(markerData.name);
        expect(marker.lat).to.equal(markerData.lat);
        expect(marker.lng).to.equal(markerData.lng);
        done();
      });
    });
  });

  it('adds paths', (done) => {
    let pathData = {
      id: 1,
      mapId: map.id,
      origin: 'LocationA',
      destination: 'LocationB'
    };

    map.addPaths([pathData]).then(map => {
      db.path.count().then(c => expect(c).to.equal(1));
      db.path.findById(1).then(path => {
        expect(path.mapId).to.equal(pathData.mapId);
        expect(path.origin).to.equal(pathData.origin);
        expect(path.destination).to.equal(pathData.destination);
        done();
      });
    });
  });
});
