function initMap () { // eslint-disable-line no-unused-vars
  let map = new google.maps.Map($('#map-display')[0], {
    center: {lat: 0, lng: 0},
    zoom: 5
  });
  window.map.map = map;

  markerHandler(map);
  directionsHandler(map);
}
