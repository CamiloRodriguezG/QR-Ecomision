import { getPuntajeTotal, playAgain, empezarJuego } from './juego.js';

let puntajeHistoria = 0;
let opcionesCorrectas = {
  3: 'B',
  5: 'A',
  7: 'A',
  '7b': 'A',
};
const paginas = {
  1: '1',
  2: '2',
  3: '3',
  4: '4',
  5: '5',
  6: '6',
  7: '7',
  8: '7b',
  9: '8b',
  10: '8m',
};

function pasarPagina(pagina, seleccion) {
  const flipbook = $('#flipbook');
  switch (pagina) {
    case 1:
      flipbook.turn('next');
      break;
    case 2:
      flipbook.turn('next');
      break;
    case 3:
      if (seleccion === opcionesCorrectas[3]) {
        puntajeHistoria += 2;
        alert(
          'Exacto. Cuando los orgánicos se compostan, devuelven nutrientes al suelo, reducen la erosión y evitan que materia orgánica contamine el agua del humedal.'
        );
      } else {
        puntajeHistoria -= 1;
        alert(
          'Casi, los malos olores pueden disminuir, pero lo más valioso es que los orgánicos bien manejados se convierten en abono y protegen el agua.'
        );
        if (puntajeHistoria < 0) puntajeHistoria = 0;
      }
      flipbook.turn('next');
      break;
    case 4:
      flipbook.turn('next');
      break;
    case 5:
      if (seleccion === opcionesCorrectas[5]) {
        puntajeHistoria += 2;
        alert(
          'Muy bien. Separar los aprovechables permite reciclarlos, reduce la carga en Doña Juana y evita que botellas y plásticos tapen canales y dañen el humedal.'
        );
      } else {
        puntajeHistoria -= 1;
        alert(
          'Buena observación, pero además de olores, la clave es que estos materiales pueden reciclarse y así disminuir lo que llega al relleno sanitario.'
        );
        if (puntajeHistoria < 0) puntajeHistoria = 0;
      }
      flipbook.turn('next');
      empezarJuego();
      break;
    case 6:
      flipbook.turn('next');
      break;
    case 7:
      if (seleccion === opcionesCorrectas[7]) {
        puntajeHistoria += 2;
        alert(
          'Exacto. Un envase sucio o un papel grasiento contamina la carga y puede hacer que todo el lote deje de ser reciclable.'
        );
      } else {
        puntajeHistoria -= 1;
        alert(
          'No exactamente, aunque parezca algo indiferente, la contaminación de materiales reciclables reduce la recuperación y aumenta lo que termina en el relleno, incrementando su sobreocupación.'
        );
        if (puntajeHistoria < 0) puntajeHistoria = 0;
      }
      flipbook.turn('next');
      break;
    case 8:
      if (seleccion === opcionesCorrectas['7b']) {
        puntajeHistoria += 2;
        alert(
          'Correcto. Pilas, medicamentos y químicos pueden filtrarse al agua y acumularse en la cadena alimentaria, dañando animales y personas.'
        );
      } else {
        puntajeHistoria -= 1;
        alert(
          'No, muchos residuos peligrosos no se degradan y liberan sustancias tóxicas que contaminan el agua y el suelo.'
        );
        if (puntajeHistoria < 0) puntajeHistoria = 0;
      }
      puntajeHistoria += getPuntajeTotal();
      if (puntajeHistoria < 0) puntajeHistoria = 0;
      console.log(puntajeHistoria);
      if (puntajeHistoria >= 9) {
        flipbook.turn('page', 9);
      } else {
        flipbook.turn('page', 10);
      }
      break;
  }
}

function flipToFirstPage(flipbook, i) {
  if (i != 1) {
    const elementoOcultar = document.querySelector(`#pagina${paginas[i]} div`);
    elementoOcultar.classList.add('hide');
  }

  if (i > 1 && i != 9) {
    setTimeout(() => {
      flipbook.turn('page', i, { duration: 100 });
      flipToFirstPage(flipbook, i - 1);
    }, 1000);
  } else if (i == 9) {
    setTimeout(() => {
      flipbook.turn('page', i - 1, { duration: 100 });
      flipToFirstPage(flipbook, i - 1);
    }, 1000);
  } else if (i == 1) {
    const divPagina1 = document.getElementById('pagina1');
    const buttonPagina1 = document.querySelector('#pagina1 .historia-button');
    buttonPagina1.style.display = 'block';
    divPagina1.style.backgroundImage = "url('./img/fondos/historia/Historia_1.1.png')";
    setTimeout(() => {
      flipbook.turn('page', i, { duration: 100 });
    }, 1000);
  }
}

function reiniciarHistoria() {
  const flipbook = $('#flipbook');
  puntajeHistoria = 0;
  let currentPage = flipbook.turn('page');
  const elementoOcultar = document.querySelector(`#pagina${paginas[currentPage]} div`);
  elementoOcultar.classList.add('hide');
  flipToFirstPage(flipbook, currentPage - 1);
  playAgain();
}

$(document).ready(function () {
  $('#flipbook').turn({
    width: $('#flipbook').width(),
    height: $('#flipbook').height(),
    autoCenter: true,
    display: 'single', // Esto muestra solo una página a la vez,
    duration: 2000,
    // when: {
    //   start: function (event, pageObject, corner) {
    //     if (corner == 'tl' || corner == 'bl' || corner == 'br') {
    //       console.log(corner);
    //       event.preventDefault();
    //     }
    //   },
    // },
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
      const residuosPag1 = document.getElementById('residuos-pag1');
      const botonPagina1 = document.querySelector('#pagina1 .historia-button');
      if (residuosPag1) residuosPag1.classList.remove('imagen-visible');
      if (botonPagina1) botonPagina1.classList.add('btn-oculto');
    }
  });
});

$('#flipbook').bind('turned', function (event, page, view) {
  const elementoOculto = document.querySelector(`#pagina${paginas[page]} .hide`);

  if (elementoOculto && page != 1) {
    elementoOculto.classList.remove('hide');
  }
  if (page == 6) {
    const pagina = document.querySelector(`[page="${page}"]`);
    pagina.firstElementChild.style.overflow = 'visible';
  }
});

$('#flipbook').bind('turning', function (event, page, view) {
  if (page == 7) {
    const pagina = document.querySelector(`[page="6"]`);
    pagina.firstElementChild.style.overflow = 'hidden';
  }
});

const flipbook = document.getElementById('flipbook');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const residuosPag1 = document.getElementById('residuos-pag1');
        const seleccion = document.querySelector('#pagina1 .contenedor-selecciones');
        setTimeout(() => {
          residuosPag1.classList.add('imagen-visible');
          seleccion.classList.remove('hide');
        }, 3500);
      }
    });
  },
  { threshold: 0.5 }
);

observer.observe(flipbook);
