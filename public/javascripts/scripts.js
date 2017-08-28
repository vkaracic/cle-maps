/* Option tabs */
$('.option-btn').on('click', function (event) {
  let name = $(this).attr('name');
  $('.option').addClass('hidden');
  $('.option-btn').removeClass('active')

  $(this).addClass('active')
  $('.option.' + name).removeClass('hidden');
});

$('.reset-position-btn').on('click', () => {
  setBounds(window.map.map);
});

/**
  * Send an AJAX request to the specified URL with the specified method.
  * Use for saving (url='/api/maps', method='POST') or updating (url='/api/maps' + mapId, method='PUT')
  */
function saveOrUpdateMap (url, method) {
  let markers = [];
  window.map.markers.forEach((marker) => {
    markers.push({placeId: marker.placeId, name: marker.name, lat: marker.lat, lng: marker.lng});
  });

  let paths = [];
  window.map.paths.forEach((path) => {
    paths.push({origin: path.origin, destination: path.destination});
  });

  $.ajax({
    url: url,
    method: method,
    data: {
      name: $('input[name=map-name]').val(),
      public: $('input[name=map-public]').is(':checked'),
      markers: JSON.stringify(markers),
      paths: JSON.stringify(paths)
    },
    success: (data) => { console.log('Success!') },
    error: (data) => { console.log('Error saving map: ' + data) }
  });
}

$('.save-map-btn').on('click', function () {
  saveOrUpdateMap('/api/maps', 'POST');
});

/* *************** MAP DETAILS *************** */

function populateMarkers (markers) {
  let service = new google.maps.places.PlacesService(window.map.map);
  markers.forEach((marker) => {
    service.getDetails(
      {placeId: marker.placeId},
      (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          addMarker([place], window.map.map);
        }
      }
    )
  });
}

function populatePaths (paths) {
  let directionsService = new google.maps.DirectionsService();
  paths.forEach((path) => {
    addPath(directionsService, path.origin, path.destination, window.map.map);
  });
}

$(document).ready(function () {
  if (mapId) {
    $.ajax({
      url: '/api/maps/' + mapId,
      method: 'GET',
      success: (data) => {
        $('input[name=map-name]').val(data.name);
        $('input[name=map-public').attr('checked', data.public);
        populateMarkers(data.markers);
        populatePaths(data.paths);

        $('.save-map-btn').remove();
        $('.map-options').append(
          '<input type="button" value="Update map", class="update-map-btn">'
        );
        $('.update-map-btn').on('click', () => {
          saveOrUpdateMap('/api/maps/' + mapId, 'PUT');
        });
      }
    });
  }
});
