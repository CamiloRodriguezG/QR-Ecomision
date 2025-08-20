let aciertos = 0, fallos = 0;
let seleccionesCorrecta = {
  3: {
    correcta: 'Contenedor verde',
    siguiente: 'p4',
    imagenLucianCorrecta: './img/lucian/Lucian_N5.png',
    imagenLucianIncorrecta: './img/lucian/Lucian_N4.png',
    imagenNairaCorrecta: './img/naira/Naira_2.png',
    imagenNairaIncorrecta: './img/naira/Naira_3.png',
  },
  4: {correcta: 'Contenedor blanco'},
  5: {correcta: 'Contenedor rojo'}
}

function pasarPagina(pagina, seleccion){
  const flipbook = $('#flipbook');
  if(pagina>=3){
    let datosPagina = seleccionesCorrecta[pagina];
    let siguientePaginaClass = datosPagina.siguiente;
    if(seleccion == datosPagina.correcta){
      aciertos++;
      $(`div.${siguientePaginaClass} .contenedor-ilustracion .lucian-vt4`).attr('src', datosPagina.imagenLucianCorrecta);
      $(`div.${siguientePaginaClass} .contenedor-ilustracion .naira-vt4`).attr('src', datosPagina.imagenNairaCorrecta);
    }else{
      fallos++;
      $(`div.${siguientePaginaClass} .contenedor-ilustracion .lucian-vt4`).attr('src', datosPagina.imagenLucianIncorrecta);
      $(`div.${siguientePaginaClass} .contenedor-ilustracion .naira-vt4`).attr('src', datosPagina.imagenNairaIncorrecta);
    }
  }
  setTimeout(()=>{
    if(pagina!=5){
      flipbook.turn('next');
    }else{
      if(fallos>=2){
        flipbook.turn('page', 7);
      }else{
        flipbook.turn('page', 6);
      }
    }
  }, 500);
}

function reiniciarHistoria(){
  const flipbook = $('#flipbook');
  console.log(aciertos);
  console.log(fallos);
  aciertos = 0;
  fallos = 0;
  flipbook.turn('page', 1);
}

$(document).ready(function () {
  $('#flipbook').turn({
    width: $('#flipbook').width(),
    height: $('#flipbook').height(),
    autoCenter: true,
    display: 'single', // Esto muestra solo una página a la vez,
    duration: 2000,
  });
  
  // Usar event delegation en el contenedor principal del flipbook
  $('#flipbook').on('click', '.historia-button', function () {
    const flipbook = $('#flipbook');
    const currentPage = flipbook.turn('page');
    const totalPages = flipbook.turn('pages') - 1;
    const seleccion = $(this).text().trim();
    if (currentPage < totalPages) {
      pasarPagina(currentPage, seleccion);
    }else{
      reiniciarHistoria();
    }
  });
});
