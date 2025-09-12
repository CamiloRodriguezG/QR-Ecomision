import { getPuntajeTotal, playAgain, empezarJuego } from './juego.js';

let puntajeHistoria = 0;
// let seleccionesCorrecta = {
//   3: {
//     correcta: 'Contenedor verde',
//     siguiente: 'p4',
//     imagenesCorrectas: ['./img/lucian/Lucian_N5.png', './img/naira/Naira_2.png'],
//     imagenesIncorrectas: ['./img/lucian/Lucian_N4.png', './img/naira/Naira_3.png'],
//     imagenLucianCorrecta: './img/lucian/Lucian_N5.png',
//     imagenLucianIncorrecta: './img/lucian/Lucian_N4.png',
//     imagenNairaCorrecta: './img/naira/Naira_2.png',
//     imagenNairaIncorrecta: './img/naira/Naira_3.png',
//   },
//   4: {
//     correcta: 'Contenedor blanco',
//     siguiente: 'p5',
//     imagenesCorrectas: ['./img/lucian/Lucian_N1.png', './img/lucas/Lucas_3.png'],
//     imagenesIncorrectas: ['./img/lucian/Lucian_N2.png', './img/lucas/Lucas_2.png'],
//     imagenLucianCorrecta: './img/lucian/Lucian_N1.png',
//     imagenLucianIncorrecta: './img/lucian/Lucian_N2.png',
//     imagenLucasCorrecta: './img/naira/Lucas_3.png',
//     imagenLucasIncorrecta: './img/naira/Lucas_2.png',
//   },
//   5: {
//     correcta: 'Contenedor rojo',
//     siguiente: 'na',
//     imagenesCorrectas: [],
//     imagenesIncorrectas: [],
//   },
// };
let opcionesCorrectas = {
  3: 'B',
  5: 'A',
  7: 'A',
  '7b': 'A',
};

function actualizarImagenes(pagina, imagenes) {
  const ilustracionPagina = document.querySelectorAll(`.${pagina} .contenedor-ilustracion img`);
  imagenes.forEach((src, index) => {
    ilustracionPagina[index].src = src;
  });
}

function pasarPagina(pagina, seleccion) {
  const flipbook = $('#flipbook');
  switch (pagina) {
    case 1:
      // const divPagina1 = document.getElementById('pagina1');
      // const buttonPagina1 = document.querySelector('#pagina1 .historia-button');
      // buttonPagina1.style.display = 'none';
      // divPagina1.style.backgroundImage = "url('./img/fondos/historia/Historia_1.2.png')";
      // setTimeout(() => {
      //   flipbook.turn('next');
      // }, 1000);
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

  // if ([3, 4, 5].includes(pagina)) {
  //   let datosPagina = seleccionesCorrecta[pagina];
  //   if (seleccion == datosPagina.correcta) {
  //     aciertos++;
  //     actualizarImagenes(datosPagina.siguiente, datosPagina.imagenesCorrectas);
  //   } else {
  //     fallos++;
  //     actualizarImagenes(datosPagina.siguiente, datosPagina.imagenesIncorrectas);
  //   }
  // }

  // if (pagina != 5) {
  //   flipbook.turn('next');
  // } else {
  //   if (fallos >= 2) {
  //     flipbook.turn('page', 7);
  //   } else {
  //     flipbook.turn('page', 6);
  //   }
  // }
}

function flipToFirstPage(flipbook, i) {
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
  return new Promise((resolve) => {
    const flipbook = $('#flipbook');
    puntajeHistoria = 0;
    let currentPage = flipbook.turn('page');
    flipToFirstPage(flipbook, currentPage - 1);
    playAgain();
    resolve();
  });
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
      const prom = reiniciarHistoria();

      prom.then(() => {
        const residuosPag1 = document.getElementById('residuos-pag1');
        const botonPagina1 = document.querySelector('#pagina1 .historia-button');
        if (residuosPag1) residuosPag1.classList.remove('imagen-visible');
        if (botonPagina1) botonPagina1.classList.add('btn-oculto');
      });
    }
  });
});

const flipbook = document.getElementById('flipbook');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const residuosPag1 = document.getElementById('residuos-pag1');
        const boton = document.querySelector('#pagina1 .historia-button');
        setTimeout(() => {
          residuosPag1.classList.add('imagen-visible');
          boton.classList.remove('btn-oculto');
        }, 3500);
      }
    });
  },
  { threshold: 0.85 }
);

observer.observe(flipbook);
