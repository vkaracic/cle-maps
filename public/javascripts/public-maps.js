$(document).ready(() => {
  $.ajax({
    url: '/api/maps/?public=true',
    method: 'GET',
    success: (data) => {
      let list = $('.map-list ul');
      data.forEach((map) => {
        let id = map.id;
        let name = map.name;
        $(list).append(
          '<li><span>' + id + '</span> <a href="/map/' + id + '">' + name + '</a></li>'
        );
      });
    }
  });
});
