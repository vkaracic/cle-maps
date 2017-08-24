$('.option-btn').on('click', function (event) {
  let name = $(this).attr('name');
  $('.option').addClass('hidden');
  $('.option-btn').removeClass('active')

  $(this).addClass('active')
  $('.option.' + name).removeClass('hidden');
})
