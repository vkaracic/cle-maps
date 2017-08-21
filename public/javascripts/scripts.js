let mapDisplayDiv = document.getElementById('map-display');
let client = new window.GoogleMapper(mapsApiKey); // eslint-disable-line
let submitBtn = document.getElementById('submitBtn');

submitBtn.addEventListener('click', () => {
  if (submitBtn.getAttribute('name') === 'location') {
    let location = document.getElementById('location').value;
    client.generateLocationMap(mapDisplayDiv, location);
  } else if (submitBtn.getAttribute('name') === 'directions') {
    let origin = document.getElementById('origin').value;
    let destination = document.getElementById('destination').value;
    client.generateDirectionMap(mapDisplayDiv, origin, destination);
  };
});
