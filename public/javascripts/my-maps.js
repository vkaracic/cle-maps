$(document).ready(() => {
  $.ajax({
    url: '/api/maps/',
    method: 'GET',
    success: (data) => {
      let list = $('.map-list ul');
      data.forEach((map) => {
        let id = map.id;
        let name = map.name;
        let publicMap = (map.public) ? 'Public' : 'Private';
        $(list).append(
          '<li><span>' + id + '</span> <a href="/map/' + id + '">' + name + '</a> (' + publicMap + ')</li>'
        );
      });
    }
  });
});
