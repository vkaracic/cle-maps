function Client (key) {
  this.key = key;
  this.location = 'Split,Croatia';
  this.height = '400';
  this.width = '600';
};

Client.prototype.iframe = function () {
  let ifr = document.createElement('iframe');
  ifr.setAttribute('height', this.height);
  ifr.setAttribute('width', this.width);
  return ifr;
};

Client.prototype.generateSource = function (endpoint, params) {
  let baseUrl = 'https://www.google.com/maps/embed/v1/' + endpoint;
  let queryString = '?key=' + this.key + '&';
  for (let key in params) {
    if (params.hasOwnProperty(key)) {
      queryString = queryString + key + '=' + params[key] + '&';
    }
  }

  return baseUrl + queryString.slice(0, -1);
};

Client.prototype.generateLocationMap = function (element) {
  let iframe = this.iframe();
  let source = this.generateSource('place', {'q': this.location});
  iframe.setAttribute('src', source);

  element.appendChild(iframe);
};

Client.prototype.generateDirectionMap = function (element, origin, destination) {
  let iframe = this.iframe();
  let source = this.generateSource('directions', {
    'origin': origin,
    'destination': destination
  });
  iframe.setAttribute('src', source);
  element.appendChild(iframe);
};

window.GoogleMapper = Client;
