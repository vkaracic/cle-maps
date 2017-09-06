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

        $('.save-map-btn').after(
          '<input type="button" value="Update map", class="update-map-btn green-submit-btn">'
        );
        $('.save-map-btn').remove();
        $('.update-map-btn').on('click', () => {
          saveOrUpdateMap('/api/maps/' + mapId, 'PUT');
        });
      }
    });
  }
});
