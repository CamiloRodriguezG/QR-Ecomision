let aciertos = 0,
  fallos = 0;
let seleccionesCorrecta = {
  3: {
    correcta: 'Contenedor verde',
    siguiente: 'p4',
    imagenesCorrectas: ['./img/lucian/Lucian_N5.png', './img/naira/Naira_2.png'],
    imagenesIncorrectas: ['./img/lucian/Lucian_N4.png', './img/naira/Naira_3.png'],
    imagenLucianCorrecta: './img/lucian/Lucian_N5.png',
    imagenLucianIncorrecta: './img/lucian/Lucian_N4.png',
    imagenNairaCorrecta: './img/naira/Naira_2.png',
    imagenNairaIncorrecta: './img/naira/Naira_3.png',
  },
  4: {
    correcta: 'Contenedor blanco',
    siguiente: 'p5',
    imagenesCorrectas: ['./img/lucian/Lucian_N1.png', './img/lucas/Lucas_3.png'],
    imagenesIncorrectas: ['./img/lucian/Lucian_N2.png', './img/lucas/Lucas_2.png'],
    imagenLucianCorrecta: './img/lucian/Lucian_N1.png',
    imagenLucianIncorrecta: './img/lucian/Lucian_N2.png',
    imagenLucasCorrecta: './img/naira/Lucas_3.png',
    imagenLucasIncorrecta: './img/naira/Lucas_2.png',
  },
  5: {
    correcta: 'Contenedor rojo',
    siguiente: 'na',
    imagenesCorrectas: [],
    imagenesIncorrectas: [],
  },
};

function actualizarImagenes(pagina, imagenes) {
  const ilustracionPagina = document.querySelectorAll(`.${pagina} .contenedor-ilustracion img`);
  imagenes.forEach((src, index) => {
    ilustracionPagina[index].src = src;
  });
}

function pasarPagina(pagina, seleccion) {
  const flipbook = $('#flipbook');
  if ([3, 4, 5].includes(pagina)) {
    let datosPagina = seleccionesCorrecta[pagina];
    if (seleccion == datosPagina.correcta) {
      aciertos++;
      actualizarImagenes(datosPagina.siguiente, datosPagina.imagenesCorrectas);
    } else {
      fallos++;
      actualizarImagenes(datosPagina.siguiente, datosPagina.imagenesIncorrectas);
    }
  }

  if (pagina != 5) {
    flipbook.turn('next');
  } else {
    if (fallos >= 2) {
      flipbook.turn('page', 7);
    } else {
      flipbook.turn('page', 6);
    }
  }

  console.log(aciertos, fallos);
}

function flipToFirstPage(flipbook, i) {
  if (i >= 1) {
    setTimeout(() => {
      flipbook.turn('page', i, { duration: 100 });
      flipToFirstPage(flipbook, i - 1);
    }, 1000);
  }
}

function reiniciarHistoria() {
  const flipbook = $('#flipbook');
  console.log(aciertos);
  console.log(fallos);
  aciertos = 0;
  fallos = 0;
  let currentPage = flipbook.turn('page');
  flipToFirstPage(flipbook, currentPage - 1);
  // flipbook.turn('page', 1);
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
    } else {
      reiniciarHistoria();
    }
  });
});