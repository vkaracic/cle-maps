$('.option-btn').on('click', function (event) {
  let name = $(this).attr('name');
  $('.option').addClass('hidden');
  $('.option-btn').removeClass('active')

  $(this).addClass('active')
  $('.option.' + name).removeClass('hidden');
});

$('.save-map-btn').on('click', function () {
  let markers = [];
  window.map.markers.forEach((marker) => {
    markers.push({name: marker.name, lat: marker.lat, lng: marker.lng});
  });

  let paths = [];
  window.map.paths.forEach((path) => {
    paths.push({origin: path.origin, destination: path.destination});
  });
  $.ajax({
    url: '/api/maps',
    method: 'POST',
    data: {
      name: $('input[name=map-name]').val(),
      public: $('input[name=map-public]').is(':checked'),
      markers: markers,
      paths: paths
    },
    success: (data) => {
      console.log('Map saved');
    },
    error: (data) => {
      console.log('Error saving map: ' + data);
    }
  });
});
