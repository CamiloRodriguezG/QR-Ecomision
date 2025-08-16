$(document).ready(function () {
  $('#flipbook').turn({
    width: $('#flipbook').width(),
    height: $('#flipbook').height(),
    autoCenter: true,
    display: 'single', // Esto muestra solo una página a la vez,
    duration: 2000,
  });

  // // Pasar página al hacer click en un botón dentro de la página
  // $('.pagina').on('click', '.contenedor-selecciones button', function () {
  //   $('#flipbook').turn('next');
  // });

  // Pasar página al hacer click en un botón dentro de la página
  $('.contenedor-selecciones button').on('click', function () {
    const flipbook = $('#flipbook');
    const totalPages = flipbook.turn('pages');
    const currentPage = flipbook.turn('page');
    console.log('Página actual:', currentPage, 'Total:', totalPages);
    if (currentPage < totalPages) {
      flipbook.turn('next');
    }
  });
});
