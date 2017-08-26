window.map = window.map || {
  markers: [],
  paths: []
};

function saveAction (option, location, removalCallback) {
  $('#items table tr:last').after(
    '<tr><td class="option-name">' + option + '</td>' +
    '<td class="option-location">' + location.name + '</td>' +
    '<td class="option-removal"><input type="button" value="Remove"></td></tr>'
  );
  $('#items table tr:last input[type=button]').on('click', function () {
    let index;
    if (option === 'markers') {
      index = window.map.markers.findIndex((obj) => { return obj.location === location.name }) + 1;
    } else if (option === 'paths') {
      index = window.map.paths.findIndex((obj) => {
        return obj.origin === location.origin && obj.destination === location.destination;
      });
      console.log(index);
    }

    window.map[option][index].obj.setMap(null); // Remove marker from map
    window.map[option].splice(index, 1); // Remove marker from global map var
    $(this).closest('tr').remove(); // Remove the table row
  });
}

function markerHandler (map) {
  let input = $('input[name=location]')[0];
  let searchBox = new google.maps.places.SearchBox(input);

  let markers = [];
  $('.submitBtn.marker').on('click', function () {
    let places = searchBox.getPlaces();

    if (places.length === 0) {
      return;
    }

    let bounds = new google.maps.LatLngBounds();
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
        title: place.name,
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        obj: marker
      });

      markers.push(marker);
      saveAction('markers', {name: place.name});

      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
}

function directionsHandler (map) {
  let directionsService = new google.maps.DirectionsService();
  function addRoute (directionsService) {
    let origin = $('input[name=origin]').val();
    let destination = $('input[name=destination]').val();

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
      } else {
        console.log('Directions request failed due to ' + status);
      }
    });

    window.map.paths.push({
      origin: origin,
      destination: destination,
      obj: directionsDisplay
    });
  }

  let originSearchBox = new google.maps.places.SearchBox($('input[name=origin]')[0]);
  let destinationSearchBox = new google.maps.places.SearchBox($('input[name=destination]')[0]);
  $('.submitBtn.directions').on('click', function () {
    if (originSearchBox.length === 0 || destinationSearchBox.length === 0) {
      return;
    }
    addRoute(directionsService);
  });
}

function initMap () { // eslint-disable-line no-unused-vars
  let map = new google.maps.Map($('#map-display')[0], {
    center: {lat: 0, lng: 0},
    zoom: 5
  });

  markerHandler(map);
  directionsHandler(map);
}
