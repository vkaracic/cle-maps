window.map = window.map || {
  map: null,
  markers: [],
  paths: []
};

function saveAction (option, location) {
  $('#items table tr:last').after(
    '<tr><td class="option-name">' + option + '</td>' +
    '<td class="option-location">' + location.name + '</td>' +
    '<td class="option-removal"><input type="button" value="Remove"></td></tr>'
  );
  $('#items table tr:last input[type=button]').on('click', function () {
    let row = $(this).closest('tr');
    let option = row.find('.option-name').text();
    if (option === 'markers') {
      index = window.map.markers.findIndex((obj) => { return obj.name === row.find('.option-location').text() });
    } else if (option === 'paths') {
      index = window.map.paths.findIndex((obj) => {
        return obj.origin === location.origin && obj.destination === location.destination;
      });
    }

    window.map[option][index].obj.setMap(null); // Remove marker from map
    window.map[option].splice(index, 1); // Remove marker from global map var
    $(this).closest('tr').remove(); // Remove the table row
  });
}

function setBounds (map) {
  let markers = window.map.markers;
  let paths = window.map.paths;
  let bounds = new google.maps.LatLngBounds();

  if (!markers && !paths) return;
  if (markers.length === 1 && !paths) {
    let marker = markers[0];
    bounds.extend(marker.placeObj.geometry.viewport);
  } else {
    let places = [];
    markers.forEach((marker) => {
      places.push(marker.placeObj.geometry.location);
    });
    paths.forEach((path) => {
      // TODO: What if multiple routes/legs?
      // response attribute has access to the routes array, unlike the .obj attribute
      places.push(path.response.routes[0].legs[0].start_location);
      places.push(path.response.routes[0].legs[0].end_location);
    });
    places.forEach((place) => {
      bounds.extend(place);
    });
  }
  map.fitBounds(bounds);
}

function addMarker (places, map) {
  if (places.length === 0) {
    return;
  }

  places.forEach(function (place) {
    if (!place.geometry) {
      console.log('Returned place [' + place + '] contains no geometry');
      return;
    }
    let icon = {
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25)
    };

    let marker = new google.maps.Marker({
      map: map,
      icon: icon,
      title: place.name,
      position: place.geometry.location
    });
    window.map.markers.push({
      name: place.name,
      placeId: place.place_id,
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
      obj: marker,
      placeObj: place
    });

    saveAction('markers', {name: place.name});
  });
  setBounds(map);
}

function markerHandler (map) {
  let input = $('input[name=location]')[0];
  let searchBox = new google.maps.places.SearchBox(input);

  $('.submitBtn.marker').on('click', function () {
    let places = searchBox.getPlaces('Split, Croatia');
    addMarker(places, map);
  });
}

function addPath (directionsService, origin, destination, map) {
  let directionsDisplay = new google.maps.DirectionsRenderer();
  directionsDisplay.setMap(map);

  directionsService.route({
    origin: origin,
    destination: destination,
    travelMode: 'DRIVING'
  }, function (response, status) {
    if (status === 'OK') {
      directionsDisplay.setDirections(response);
      saveAction('paths', {name: origin + ' - ' + destination, origin: origin, destination: destination});
      window.map.paths.push({
        origin: origin,
        destination: destination,
        obj: directionsDisplay,
        response: response
      });

      setBounds(map);
    } else {
      console.log('Directions request failed due to ' + status);
    }
  });
}

function directionsHandler (map) {
  let directionsService = new google.maps.DirectionsService();

  let originSearchBox = new google.maps.places.SearchBox($('input[name=origin]')[0]);
  let destinationSearchBox = new google.maps.places.SearchBox($('input[name=destination]')[0]);
  $('.submitBtn.directions').on('click', function () {
    if (originSearchBox.length === 0 || destinationSearchBox.length === 0) {
      return;
    }
    let origin = $('input[name=origin]').val();
    let destination = $('input[name=destination]').val();
    addPath(directionsService, origin, destination, map);
  });
}

function initMap () { // eslint-disable-line no-unused-vars
  let map = new google.maps.Map($('#map-display')[0], {
    center: {lat: 0, lng: 0},
    zoom: 5
  });
  window.map.map = map;

  markerHandler(map);
  directionsHandler(map);
}
