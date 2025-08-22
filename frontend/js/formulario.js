const formIngreso = document.querySelector('.form-ingreso');
const formDatosPersonales = document.getElementById('form-datos-personales');
const nombreInput = document.getElementById('nombre');
const numeroPregunta = document.getElementById('numero-pregunta');
const textoBienvenida = document.querySelector('.texto-bienvenida');
const formContainer = document.getElementById('form-preguntas');
const preguntas = document.querySelectorAll('.pregunta-contenedor');
const imagenLucian = document.querySelector('.imagen-lucian');
const btnAnterior = document.getElementById('anterior-btn');
const btnSiguiente = document.getElementById('siguiente-btn');
const opcionesPreguntas = document.querySelectorAll('.opcion-pregunta');
const numeroUsuarios = document.getElementById('numero-usuarios');
const barraAvance = document.querySelector('.barra-avance');
const contenedorResultados = document.getElementById('resultados-container');

let preguntasTotales = preguntas.length;
let indiceActual = 0;
let usuariosConectados = 0;
let avance = 0;
let totalAns;
const socket = io();

// Funcion para obtener total de respuestas del test
async function obtenerTotalAnswers() {
  try {
    const response = await fetch('/personajes/totalAnswers');
    if (!response.ok) throw new Error('Error en la respuesta');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en la petición:', error);
    return error;
  }
}

// Evento para el formulario de ingreso
formDatosPersonales.addEventListener('submit', (e) => {
  e.preventDefault();

  const nombre = nombreInput.value.trim();

  if (nombre) {
    localStorage.setItem('usuarioNombreQREM', nombre);

    // Ocultar el formulario de ingreso
    formIngreso.classList.add('oculto');

    // Iniciar el test
    iniciarTest();
  }
});

socket.on('userCount', (cantidad) => {
  numeroUsuarios.style.opacity = '0';
  setTimeout(() => {
    numeroUsuarios.textContent = cantidad;
    numeroUsuarios.style.opacity = '1';
  }, 500);
});

opcionesPreguntas.forEach((op) => {
  op.addEventListener('click', () => {
    // Obtener el contenedor de opciones (ul) de la pregunta actual
    const contenedorOpciones = op.closest('.opciones-contenedor');

    contenedorOpciones.querySelectorAll('.opcion-pregunta').forEach((opcion) => {
      opcion.classList.remove('opcion-seleccionada');
    });

    op.classList.add('opcion-seleccionada');
  });
});

function mostrarPregunta(nueva) {
  const preguntaActual = preguntas[indiceActual];
  preguntaActual.classList.remove('active');
  preguntaActual.classList.add(nueva > indiceActual ? 'exit-up' : 'exit-down');

  indiceActual = nueva;

  const siguiente = preguntas[indiceActual];
  siguiente.classList.remove('exit-up', 'exit-down');
  siguiente.classList.add('active');

  btnAnterior.disabled = indiceActual === 0;
  if (indiceActual === 0) {
    btnAnterior.classList.add('btn-desactivado');
  } else {
    btnAnterior.classList.remove('btn-desactivado');
  }

  if (indiceActual === preguntas.length - 1) {
    btnSiguiente.textContent = 'Finalizar';
    btnSiguiente.style.background = 'var(--color-azul)';
  } else {
    btnSiguiente.textContent = 'Siguiente';
    btnSiguiente.style.background = '';
  }

  avance = (indiceActual * 100) / preguntasTotales;
  barraAvance.style.width = `${avance}%`;
}

async function cargarResultados(usuario, opcionesSeleccionadas) {
  const personajesInfo = {
    Lucian: {
      nombre: 'Lucian',
      texto:
        'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quo libero necessitatibus quis velit provident sit error mollitia delectus.',
      imagen: '../img/lucian/Lucian_N1.png',
    },
    Naira: {
      nombre: 'Naira',
      texto:
        'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quo libero necessitatibus quis velit provident sit error mollitia delectus.',
      imagen: '../img/naira/Naira_1.png',
    },
    Lucas: {
      nombre: 'Lucas',
      texto:
        'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quo libero necessitatibus quis velit provident sit error mollitia delectus.',
      imagen: '../img/lucas/Lucas_1.png',
    },
    /*
    pendiente: {
      nombre: '¿?',
      texto: '¿?',
      imagen: '',
    },
    */
  };

  /*
  SOLO POR MIENTRAS, MODIFICAR UNA VEZ HAYA TEST
  */
  let personajes = Object.values(personajesInfo);
  let indiceAleatorio = Math.floor(Math.random() * personajes.length);
  const personajeSeleccionado = personajes[indiceAleatorio];
  personajes.splice(indiceAleatorio, 1);
  /*
  ACA TERMINA LO PROVISIONAL
  */

  /* ACTUALIZACION EN EL BACKEND */
  try {
    const response = await fetch(`/personajes/${personajeSeleccionado.nombre}/increment`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Error en la respuesta');

    const data = await response.json();
    console.log('SUCCESS', data);
  } catch (error) {
    console.error('Error en la petición:', error);
  }

  /* INSERCION HTML DE RESULTADOS */

  contenedorResultados.innerHTML = `
      <h2 class="titulo-subtitulo">Querido ${usuario} ¡Tenemos tus resultados!</h2>
      <div class="personaje-seleccionado-card">
        <div class="imagen-personaje-seleccionado">
          <img src="${personajeSeleccionado.imagen}" alt="${personajeSeleccionado.nombre}" />
        </div>
        <div class="descripcion-personaje-seleccionado">
          <h3 class="titulo-subtitulo">${personajeSeleccionado.nombre}</h3>
          <p class="texto-alt">${personajeSeleccionado.texto}</p>
        </div>
      </div>
      <h4 class="titulo-subtitulo">Pero tambien puedes ser ellos:</h2>
      <div class="otros-personajes">
      </div>
  `;
  let otrosPersonajesContenedor = document.querySelector('.otros-personajes');
  personajes.forEach((personajeTmp) => {
    otrosPersonajesContenedor.innerHTML += `
        <div class="otro-personaje-card">
          <div class="imagen-personaje-alt">
            <img src="${personajeTmp.imagen}" alt="${personajeTmp.nombre}" />
          </div>
          <div class="descripcion-personaje-alt">
            <h3 class="titulo-subtitulo">${personajeTmp.nombre}</h3>
            <p class="texto-alt">${personajeTmp.texto}</p>
          </div>
        </div>
    `;
  });

  /* INSERCION HTML DEL RANKING, POR AHORA SOLO TOP 3*/
  let data;
  try {
    const response = await fetch('/personajes');
    if (!response.ok) {
      contenedorResultados.innerHTML += '<h5>Error 1 con el ranking</h5>';
      throw new Error('Error en la respuesta');
    }
    data = await response.json();
  } catch (error) {
    console.error('Error en la petición:', error);
    contenedorResultados.innerHTML += '<h5>Error 2 con el ranking</h5>';
    throw new Error('Error en la respuesta');
  }
  let podio = data.slice(0, 3);
  contenedorResultados.innerHTML += `
      <section class="top-personajes">
        <h2 class="titulo-subtitulo">🏅 Top 3 personajes</h2>
        <div class="top-cards">
        </div>
      </section>
  `;
  let contenedorTarjetasTop = document.querySelector('.top-cards');

  let { personaje, count } = podio[1];
  let { imagen } = personajesInfo[personaje];

  contenedorTarjetasTop.innerHTML += `
    <div class="card plata">
      <span class="medalla"><i class="fas fa-medal"></i></span>
      <img src="${imagen}" alt="${personaje}" />
      <div>
        <h3 class="titulo-subtitulo">${personaje}</h3>
        <p class="texto-alt card-count">${count}</p>
      </div>
    </div>
  `;

  ({ personaje, count } = podio[0]);
  ({ imagen } = personajesInfo[personaje]);
  contenedorTarjetasTop.innerHTML += `
    <div class="card oro">
      <span class="medalla"><i class="fas fa-trophy"></i></span>
      <img src="${imagen}" alt="${personaje}" />
      <div>
        <h3 class="titulo-subtitulo">${personaje}</h3>
        <p class="texto-alt card-count">${count}</p>
      </div>
    </div>
  `;

  ({ personaje, count } = podio[2]);
  ({ imagen } = personajesInfo[personaje]);
  contenedorTarjetasTop.innerHTML += `
    <div class="card bronce">
      <span class="medalla"><i class="fas fa-medal"></i></span>
      <img src="${imagen}" alt="${personaje}" />
      <div>
        <h3 class="titulo-subtitulo">${personaje}</h3>
        <p class="texto-alt card-count">${count}</p>
      </div>
    </div>
  `;
}

btnSiguiente.addEventListener('click', () => {
  const preguntaActual = preguntas[indiceActual];

  // Verificar si hay alguna opción seleccionada en la pregunta actual
  const opcionSeleccionada = preguntaActual.querySelector('.opcion-seleccionada');

  if (!opcionSeleccionada) {
    // Obtener el contenedor de opciones y activar la animación de terremoto
    const contenedorOpciones = preguntaActual.querySelector('.opciones-contenedor');
    contenedorOpciones.classList.add('terremoto');

    // Remover la clase después de que termine la animación
    setTimeout(() => {
      contenedorOpciones.classList.remove('terremoto');
    }, 1000);

    return;
  }

  if (indiceActual < preguntas.length - 1) {
    mostrarPregunta(indiceActual + 1);
    numeroPregunta.textContent = `Pregunta No. ${indiceActual + 1}`;
  } else {
    let opcionesSeleccionadas = [];
    opcionesPreguntas.forEach((op) => {
      if (op.classList.contains('opcion-seleccionada')) {
        opcionesSeleccionadas.push(op.textContent);
      }
    });
    const usuario = localStorage.getItem('usuarioNombreQREM');

    cargarResultados(usuario, opcionesSeleccionadas);

    setTimeout(() => {
      formContainer.classList.add('deshabilitado');
      document.getElementById('form-container').style.backgroundImage = 'none';
      barraAvance.style.width = '100%';
      document.getElementById('resultados-container').scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 500);
  }
});

btnAnterior.addEventListener('click', () => {
  if (indiceActual > 0) {
    mostrarPregunta(indiceActual - 1);
    numeroPregunta.textContent = `Pregunta No. ${indiceActual + 1}`;
  }
});

// Función para iniciar el test
async function iniciarTest() {
  const nombre = localStorage.getItem('usuarioNombreQREM');
  totalAns = await obtenerTotalAnswers();
  textoBienvenida.innerHTML = `<h1>¡Bienvenido <span class="nombre-bienvenida">${nombre}</span>!<br>descubramos que guardián verde eres, serás el número ${
    totalAns + 1
  } en hacerlo.</h1>`;
  // Mostrar la primera pregunta
  preguntas[0].classList.add('active');
  numeroPregunta.textContent = 'Pregunta No. 1';
}

// Función para verificar si ya existen datos del usuario
function verificarDatosUsuario() {
  const nombre = localStorage.getItem('usuarioNombreQREM');

  if (nombre) {
    // Si ya existen los datos, ocultar el formulario e iniciar el test
    formIngreso.classList.add('oculto');
    iniciarTest();
  }
}

// Verificar datos al cargar la página
document.addEventListener('DOMContentLoaded', verificarDatosUsuario);
