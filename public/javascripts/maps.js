function Client (key) {
  this.key = key;
  this.location = 'Split,Croatia';
  this.height = '400';
  this.width = '600';
};

Client.prototype.iframe = function () {
  return $('<iframe>', {
    height: this.height,
    width: this.width
  });
};

Client.prototype.generateSource = function (endpoint, params) {
  let baseUrl = 'https://www.google.com/maps/embed/v1/' + endpoint;
  let queryString = '?&key=' + this.key + '&' + $.param(params)
  return baseUrl + queryString;
};

Client.prototype.generateLocationMap = function (element) {
  $(element).empty();
  let iframe = this.iframe();
  let source = this.generateSource('place', {'q': this.location});
  iframe.attr('src', source);

  element.append(iframe);
};

Client.prototype.generateDirectionMap = function (element, origin, destination) {
  $(element).empty();
  let iframe = this.iframe();
  let source = this.generateSource('directions', {
    'origin': origin,
    'destination': destination
  });
  iframe.attr('src', source);
  element.append(iframe);
};

window.GoogleMapper = Client;
