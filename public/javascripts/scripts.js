let $mapDisplayDiv = $('#map-display');
let client = new window.GoogleMapper(mapsApiKey); // eslint-disable-line

$('.submitBtn.place').on('click', () => {
  let location = $('#location').val();
  client.generateLocationMap($mapDisplayDiv, location);
});

$('.submitBtn.directions').on('click', () => {
  let origin = $('#origin').val();
  let destination = $('#destination').val();
  client.generateDirectionMap($mapDisplayDiv, origin, destination);
});

$('.action-btn').on('click', function (event) {
  let name = $(this).attr('name');
  $('.action').addClass('hidden');
  $('.action.' + name).removeClass('hidden');
})
