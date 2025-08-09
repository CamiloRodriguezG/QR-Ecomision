const textoHistoria = document.getElementById('contenedor-texto-historia');
const ilustracion = document.getElementById('contenedor-ilustracion');
const selecciones = document.getElementById('contenedor-selecciones');

let ubicacionHistoria = 0;

const imagenes = {
  Lucian: {
    normal: ['img/lucian/Lucian_1.png', 'img/lucian/Lucian_3.png', 'img/lucian/Lucian_5.png'],
    incorrecto: ['img/lucian/Lucian_2.png', 'img/lucian/Lucian_4.png'],
  },
};

const partesHistoria = {
  0: {
    texto: [
      'Bienvenido, amigo. Hoy descubriremos juntos cómo cada uno de nuestros actos impacta este lugar.',
      'Ven, acompáñame junto a dos guardianes muy especiales...',
    ],
    opciones: [],
    opcionCorrecta: -1,
    personajes: ['Lucian'],
  },
  1: {
    texto: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
    opciones: ['Opción 1', 'Opción 2'],
    opcionCorrecta: -1,
    personaje: 'Lucian',
  },
  2: {
    texto: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
    opciones: ['Opción 1', 'Opción 2'],
    opcionCorrecta: -1,
    personaje: 'Lucian',
  },
  3: {
    texto: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
    opciones: ['Opción 1', 'Opción 2'],
    opcionCorrecta: -1,
    personaje: 'Lucian',
  },
};

function iniciarHistoria() {
  const parteHistoria = partesHistoria[ubicacionHistoria];

  textoHistoria.innerHTML = `
    <p>
    ${parteHistoria.texto}
    </p>
  `;
  const personaje = parteHistoria.personaje;
  // Obtener una imagen aleatoria del array normal
  const imagenesNormales = imagenes[personaje].normal;
  const imagenAleatoria = imagenesNormales[Math.floor(Math.random() * imagenesNormales.length)];

  ilustracion.innerHTML = `
    <img src="${imagenAleatoria}" alt="Ilustracion">
  `;
  for (let i = 0; i < parteHistoria.opciones.length; i++) {
    selecciones.innerHTML += `
      <button class="historia-opcion h-opcion-${i}" onclick="elegirOpcion(${i})">${parteHistoria.opciones[i]}</button>
    `;
  }
}

function elegirOpcion(opcionSeleccionada) {
  // logica de avance en la historia
}

document.addEventListener('DOMContentLoaded', iniciarHistoria);
