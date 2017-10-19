window.map = window.map || {
  map: null,
  markers: [],
  paths: [],
  infoWindows: [],
};

let iconBase = '/images/icons/';

function saveAction (option, location) {
  $('#items table tr:last').after(
    '<tr><td class="option-name">' + option + '</td>' +
    '<td class="option-location">' + location.name + '</td>' +
    '<td class="option-removal"><input type="button" class="btn btn-danger" value="Remove"></td></tr>'
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
    } else if (option === 'infoWindows') {
      index = window.map.infoWindows.findIndex((obj) => {
        return obj.name = row.find('.option-location').text();
      });
    }

    window.map[option][index].obj.setMap(null); // Remove item from map
    window.map[option].splice(index, 1); // Remove item from global map var
    $(this).closest('tr').remove(); // Remove the table row
  });
}

function locationRepr (location) {
  if (location.place) {
    return
  }
}

function setBounds (map) {
  let markers = window.map.markers;
  let paths = window.map.paths;
  let bounds = new google.maps.LatLngBounds();

  if (!markers && !paths) return;
  if (markers.length === 1 && paths.length < 1) {
    let marker = markers[0];
    bounds.union(marker.placeObj.geometry.viewport);
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
      placeId: place.place_id, // For saving to database and finding the place on GMaps afterwards.
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
      obj: marker,
      placeObj: place
    });

    saveAction('markers', {name: place.name});
  });
  setBounds(map);
}

function addInfoWindow (location, map, content) {
  let infowindow = new google.maps.InfoWindow({content: content});
  let marker;
  let position;
  let saveData = {content: content};

  if (location.place || location.coords) {
    if (location.place) {
      saveData.name = location.place.name;
      saveData.placeId = location.place.place_id;
      position = location.place.geometry.location;
    } else {
      saveData.name = location.coords.lat + ', ' + location.coords.lng;
      saveData.placeId = null;
      saveData.lat = location.coords.lat;
      saveData.lat = location.coords.lat;
      position = new google.maps.LatLng(location.coords.lat, location.coords.lng);
    }
    marker = new google.maps.Marker({
      map: map,
      icon: iconBase + 'chat-bubble-icon.png',
      position: position
    });
    saveData.obj = marker;
    marker.addListener('click', () => infowindow.open(map, marker));
    infowindow.open(map, marker);

    window.map.infoWindows.push(saveData);
    saveAction('infoWindows', {name: saveData.name})
  } else { return }
}

function infoWindowHandler (map) {
  // @TODO create global searchbox input class and handler.
  let input = $('#info-window input[name=location]')[0];
  let searchBox = new google.maps.places.SearchBox(input);

  $('#info-window input[type=button]').click(function () {
    let places = searchBox.getPlaces();
    let content = $('#info-window textarea').val();
    let location = (places) ? {place: places[0]} : {coords: {
      lat: Number($('#info-window input[name=latitude]').val()),
      lng: Number($('#info-window input[name=longitude]').val())
    }};

    addInfoWindow(location, map, content);
  });
}

function markerHandler (map) { // eslint-disable-line no-unused-vars
  let input = $('#marker input[name=location]')[0];
  let searchBox = new google.maps.places.SearchBox(input);

  $('.submitBtn.marker').on('click', function () {
    let places = searchBox.getPlaces();
    addMarker(places, map);  // @TODO isn't 'map' a global?
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

function directionsHandler (map) { // eslint-disable-line no-unused-vars
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

function populateMarkers (markers) { // eslint-disable-line no-unused-vars
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

function populatePaths (paths) { // eslint-disable-line no-unused-vars
  let directionsService = new google.maps.DirectionsService();
  paths.forEach((path) => {
    addPath(directionsService, path.origin, path.destination, window.map.map);
  });
}

function populateInfoWindows (infoWindows) {
  let service = new google.maps.places.PlacesService(window.map.map);

  infoWindows.forEach((iWindow) => {
    if (iWindow.placeId) {
      // @TODO: DRY
      service.getDetails(
        {placeId: iWindow.placeId},
        (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            addInfoWindow({place: place}, window.map.ap, iWindow.content);
          }
        }
      )
    } else {
      addInfoWindow({coords: {
        lat: iWindow.lat,
        lng: iWindow.lng
      }}, window.map.ap, iWindow.content);
    }
  });
}
