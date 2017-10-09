$(document).ready(() => {
  $.ajax({
    url: '/api/maps/' + mapId,
    method: 'GET',
    success: (data) => {
      $('h3').text(data.name);
      populateMarkers(data.markers);
      populatePaths(data.paths);
    },
    error: (err) => {
      console.log(err);
    }
  });
});

function initMap () { // eslint-disable-line no-unused-vars
  let map = new google.maps.Map($('#map-display')[0], {
    center: {lat: 0, lng: 0},
    zoom: 5
  });
  window.map.map = map;
}
