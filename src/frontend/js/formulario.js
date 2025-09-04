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

function obtenerPersonaje(opcionesSeleccionadas) {
  console.log(opcionesSeleccionadas);
  const respuestas = {
    preguntas: [
      {
        id: 1,
        texto: 'En tu grupo de amigos, tú eres más…',
        opciones: [
          { texto: 'Quien da consejos prácticos y tranquilos.', personaje: 'Lucian' },
          { texto: 'Quien siempre inventa algo nuevo con lo que hay.', personaje: 'Lucas' },
          { texto: 'Quien que todos hagan las cosas bien y ordenadas.', personaje: 'Naira' },
          { texto: 'Quien asume los riesgos y protege al grupo.', personaje: 'Rojo' },
        ],
      },
      {
        id: 2,
        texto: 'Encuentras una botella plástica vacía en la calle: ¿qué haces?',
        opciones: [
          {
            texto: 'Si está sucia, la limpio y la dispongo adecuadamente en la bolsa reciclaje.',
            personaje: 'Naira',
          },
          { texto: 'La guardo por si puedo transformarla en algo útil.', personaje: 'Lucas' },
          {
            texto:
              'Pienso que, si no se gestiona, terminará dañando el suelo, prefiero depositarla en el contenedor correcto.',
            personaje: 'Lucian',
          },
          {
            texto:
              'Me preocupa que algunos envases contengan algo peligroso, verifico si requiere manejo especial.',
            personaje: 'Rojo',
          },
          { texto: 'No hacer ninguna acción y seguir por delante', personaje: null },
        ],
      },
      {
        id: 3,
        texto: 'En relación al agua en casa (uso en limpieza, ducha, riego), tú normalmente:',
        opciones: [
          {
            texto:
              'Reutilizas aguas de la ducha o lavadora para riego y fomentas el ahorro del agua.',
            personaje: 'Lucian',
          },
          {
            texto:
              'Evitas verter aceites de cocina usado al fregadero y reciclas el agua cuando es posible.',
            personaje: 'Naira',
          },
          {
            texto: 'Buscas soluciones caseras para captar agua y reutilizarla.',
            personaje: 'Lucas',
          },
          {
            texto:
              'Cuidas que productos químicos domésticos no entren al sistema de agua para evitar que se contamine.',
            personaje: 'Rojo',
          },
        ],
      },
      {
        id: 4,
        texto: 'Cuando ves restos de frutas o verduras después de cocinar, piensas que…',
        opciones: [
          { texto: 'Son alimento para la tierra, deberían volver al suelo.', personaje: 'Lucian' },
          {
            texto: 'Tal vez podrían usarse para hacer otra cosa creativa, no todo es basura.',
            personaje: 'Lucas',
          },
          {
            texto: 'Si no se separan bien terminan contaminando el agua y eso me preocupa.',
            personaje: 'Naira',
          },
          {
            texto:
              'Algunos restos pueden atraer plagas o enfermedades, hay que manejarlos con cuidado.',
            personaje: 'Rojo',
          },
          { texto: 'Disponer el residuo en cualquier basura.', personaje: null },
        ],
      },
      {
        id: 5,
        texto: '¿Qué haces cuando terminas un jugo en caja (Tetrapak)?',
        opciones: [
          {
            texto:
              'Me aseguro de vaciar el resto de contenido en orgánicos y luego si se dispone en la bolsa blanca.',
            personaje: 'Naira',
          },
          { texto: 'Pienso en usarlo como artesanías o manualidades.', personaje: 'Lucas' },
          {
            texto: 'Reflexiono en cómo esos empaques duran tanto y afectan a la tierra.',
            personaje: 'Lucian',
          },
          {
            texto:
              'Me preocupa si queda con residuos líquidos que puedan contaminar o atraer bichos.',
            personaje: 'Rojo',
          },
        ],
      },
      {
        id: 6,
        texto: '¿Qué haces con las cosas que ya no sirven en casa?',
        opciones: [
          {
            texto: 'Trato de repararlas o darles otro uso para extender su vida útil.',
            personaje: 'Lucas',
          },
          { texto: 'Reviso si pueden reciclarse y van a la bolsa correcta.', personaje: 'Naira' },
          {
            texto: 'Pienso si son orgánicas y podrían regresar al ciclo natural.',
            personaje: 'Lucian',
          },
          {
            texto: 'Me fijo si son peligrosas (pilas, químicos) y las separo con cuidado.',
            personaje: 'Rojo',
          },
          { texto: 'Tirarlo en la basura porque no funciona.', personaje: null },
        ],
      },
      {
        id: 7,
        texto: '¿Qué haces con las pilas usadas en tu casa?',
        opciones: [
          { texto: 'Busco un punto de recolección segura.', personaje: 'Rojo' },
          {
            texto: 'Emplear pilas recargables que permitan extender uso y vida útil.',
            personaje: 'Lucas',
          },
          { texto: 'Las separo de los demás residuos para que no contaminen.', personaje: 'Naira' },
          {
            texto: 'Pienso en cómo afectan al suelo si no se gestionan bien.',
            personaje: 'Lucian',
          },
          { texto: 'Desecharlas en la primera basura que encuentro.', personaje: null },
        ],
      },
      {
        id: 8,
        texto:
          'Si tu comunidad crea un reto para mejorar la gestión de residuos, ¿qué rol tomarías?',
        opciones: [
          {
            texto:
              'Enseñar cómo compostar y explicar por qué importa devolver materia a la tierra.',
            personaje: 'Lucian',
          },
          {
            texto: 'Coordinar la separación y buscar alianzas con recicladores locales.',
            personaje: 'Naira',
          },
          {
            texto: 'Idear proyectos creativos con materiales que ya no sirven.',
            personaje: 'Lucas',
          },
          {
            texto: 'Asegurar protocolos para residuos que representen un riesgo (pilas, químicos).',
            personaje: 'Rojo',
          },
        ],
      },
      {
        id: 9,
        texto: 'Ves basura flotando en un canal cercano: tu primer pensamiento es…',
        opciones: [
          {
            texto: '¿Cómo podemos devolver el equilibrio al ecosistema con soluciones naturales?',
            personaje: 'Lucian',
          },
          {
            texto:
              '¿Cómo evitar que esto afecte la vida del agua y qué materiales se pudieron separar?',
            personaje: 'Naira',
          },
          {
            texto: '¿Cómo podemos evitar la contaminación al transformar en algo?',
            personaje: 'Lucas',
          },
          {
            texto: '¿Hay sustancias peligrosas allí que requieran reporte y manejo especializado?',
            personaje: 'Rojo',
          },
        ],
      },
      {
        id: 10,
        texto: 'Piensas en el futuro de tu barrio: ¿qué imagen te gustaría ver?',
        opciones: [
          {
            texto: 'Huertas y suelos fértiles donde vuelva lo que se consume.',
            personaje: 'Lucian',
          },
          {
            texto: 'Sistemas de reciclaje que impulsen emprendimientos locales.',
            personaje: 'Naira',
          },
          {
            texto: 'Comunidades creativas que transformen lo desechado en recursos.',
            personaje: 'Lucas',
          },
          {
            texto: 'Zonas seguras donde los residuos peligrosos se gestionen correctamente.',
            personaje: 'Rojo',
          },
        ],
      },
      {
        id: 11,
        texto: 'En relación con vegetación y corredores verdes en tu entorno, tú prefieres:',
        opciones: [
          {
            texto: 'Cultivar y proteger especies que nutran el suelo y atraigan biodiversidad.',
            personaje: 'Lucian',
          },
          {
            texto: 'Promover zonas limpias y señalizadas que eviten contaminación del hábitat.',
            personaje: 'Naira',
          },
          {
            texto:
              'Diseñar pequeños proyectos participativos (jardines con materiales reciclados).',
            personaje: 'Lucas',
          },
          {
            texto: 'Asegurar que no se ingresen materiales peligrosos a estos espacios.',
            personaje: 'Rojo',
          },
        ],
      },
      {
        id: 12,
        texto: 'Si tuvieras que dar un consejo rápido sobre residuos, dirías:',
        opciones: [
          { texto: '“Devuelve a la tierra lo que le pertenece.”', personaje: 'Lucian' },
          { texto: '“Separa lo limpio y dalo al que puede aprovecharlo.”', personaje: 'Naira' },
          { texto: '“Si no sirve ni se transforma, al negro debe.”', personaje: 'Lucas' },
          {
            texto: '“Lo peligroso no se mezcla: Entrégalo de forma segura en el lugar correcto.”',
            personaje: 'Rojo',
          },
        ],
      },
    ],
  };
  const puntajes = {};

  opcionesSeleccionadas.forEach((respuestaTexto, preguntaIndex) => {
    respuestaTexto = respuestaTexto.trim();
    const pregunta = respuestas.preguntas[preguntaIndex];
    if (!pregunta) return;

    const opcionElegida = pregunta.opciones.find((op) => op.texto === respuestaTexto);

    if (opcionElegida && opcionElegida.personaje) {
      puntajes[opcionElegida.personaje] = (puntajes[opcionElegida.personaje] || 0) + 1;
    }
  });

  let personajeGanador = null;
  let maxPuntos = -1;

  for (const [personaje, puntos] of Object.entries(puntajes)) {
    if (puntos > maxPuntos) {
      personajeGanador = personaje;
      maxPuntos = puntos;
    }
  }
  return personajeGanador === 'Rojo' ? 'Lucian' : personajeGanador;
}

async function cargarResultados(usuario, opcionesSeleccionadas) {
  const personajesInfo = {
    Lucian: {
      nombre: 'Lucian',
      texto: `
      <div>
        <h3 class="titulo-subtitulo texto-verde">Lucian</h3>
        <p class="texto-alt">
          Soy Lucian, tranquilo y paciente como la naturaleza. Mi misión es enseñarte a cuidar la tierra separando los residuos orgánicos en la <span class="texto-verde">bolsa verde</span>, como cáscaras de frutas, restos de comida o plantas secas, que pueden transformarse en abono para dar nueva vida a los suelos. Al hacerlo, reducimos la cantidad de basura y devolvemos a la naturaleza lo que ella misma nos dio.
        </p>
      </div>
      <div class="texto-alt">
        <h5 class="titulo-subtitulo texto-verde">Recuerda residuos como...</h5>
        <p>Cáscaras de plátano</p>
        <p>Restos de pan</p>
        <p>Hojas y ramas secas</p>
      </div>
      `,
      imagen: '../img/lucian/Lucian_N1.png',
      color: 'verde',
    },
    Naira: {
      nombre: 'Naira',
      texto: `
      <div>
        <h3 class="titulo-subtitulo texto-azul">Naira</h3>
        <p class="texto-alt">
          Soy Naira, protectora de los ríos y del aire limpio.
          Me encargo de enseñarte a separar los residuos aprovechables, como botellas plásticas, vidrio, cartón limpio y metales en la <span class="texto-azul">bolsa blanca</span>, que pueden reciclarse y convertirse en nuevos productos. Separarlos correctamente evita que terminen contaminando el agua y la tierra, y ayuda a reducir la explotación de recursos naturales. 
        </p>
      </div>
      <div class="texto-alt">
        <h5 class="titulo-subtitulo texto-azul">Recuerda residuos como...</h5>
        <p>Botellas plasticas</p>
        <p>Latas de gaseosa</p>
        <p>Cartón y papel</p>
      </div>
      `,
      imagen: '../img/naira/Naira_1.png',
      color: 'blanco',
    },
    Lucas: {
      nombre: 'Lucas',
      texto: `
      <div>
        <h3 class="titulo-subtitulo texto-negro">Lucas</h3>
        <p class="texto-alt">
          Soy Lucas, curioso y creativo, siempre buscando ideas nuevas para reutilizar lo que parece no tener uso. Mi papel es mostrarte cómo identificar los residuos no aprovechables, como servilletas sucias, papeles contaminados o empaques metalizados, que deben ir en la <span class="texo-negro bold">bolsa negra</span>. Aunque muchos no se reciclan, algunos pueden inspirar a crear algo nuevo y así darles una segunda vida. 
        </p>
      </div>
      <div class="texto-alt">
        <h5 class="titulo-subtitulo texto-negro">Recuerda residuos como...</h5>
        <p>Botellas plasticas</p>
        <p>Latas de gaseosa</p>
        <p>Cartón y papel</p>
      </div>
      `,
      imagen: '../img/lucas/Lucas_1.png',
      color: 'negro',
    },
    /*
    pendiente: {
      nombre: '¿?',
      texto: '¿?',
      imagen: '',
      color: 'bg-rojo'
    },
    */
  };

  let personajes = Object.values(personajesInfo);
  const personajeSeleccionado = personajesInfo[obtenerPersonaje(opcionesSeleccionadas)];
  console.log(personajeSeleccionado);
  personajes = personajes.filter((p) => p.nombre !== personajeSeleccionado.nombre);
  console.log(personajes);

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
      <div class="resultado-principal">
        <h2 class="titulo-subtitulo">Querido ${usuario} ¡Tenemos tus resultados!</h2>
        <div class="personaje-seleccionado-card bg-${personajeSeleccionado.color}">
          <div class="imagen-personaje-seleccionado">
            <img src="${personajeSeleccionado.imagen}" alt="${personajeSeleccionado.nombre}" />
          </div>
          <div class="descripcion-personaje-seleccionado">
            ${personajeSeleccionado.texto}
          </div>
        </div>
        <a class="button-abs titulo-subtitulo" href="#opc">Más informacion</a>
      </div>
      <div id="opc" class="otros-personajes-contenedor">
        <h4 class="titulo-subtitulo">Descubre como podrias mejorar lo que ya tienes:</h2>
        <div class="otros-personajes">
        </div>
        <a class="button-abs titulo-subtitulo" href="#tp">Más informacion</a>
      </div>
  `;
  let otrosPersonajesContenedor = document.querySelector('.otros-personajes');
  personajes.forEach((personajeTmp) => {
    otrosPersonajesContenedor.innerHTML += `
        <div class="otro-personaje-card bg-${personajeTmp.color}">
          <div class="imagen-personaje-alt">
            <img src="${personajeTmp.imagen}" alt="${personajeTmp.nombre}" />
          </div>
          <div class="descripcion-personaje-alt">
            ${personajeTmp.texto}
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
      <section id="tp" class="top-personajes">
        <h2 class="titulo-subtitulo">🏅 Top 3 personajes más frecuentes en los resultados</h2>
        <div class="top-cards">
        </div>
        <a class="button-abs titulo-subtitulo" href="#rating-section">Calificanos</a>
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
  const ratingContainer = document.getElementById('rating-section');
  ratingContainer.style.display = 'flex';
  ratingContainer.innerHTML = `
  <h2 class="titulo-subtitulo">Ayudanos calificandonos</h2>
      <form id="encuesta-form">
        <fieldset class="rating texto-alt">
          <legend>Pregunta 1</legend>
          <input type="radio" id="q1-star5" name="rating1" value="5" />
          <label class="full" for="q1-star5" title="Awesome - 5 stars"></label>

          <input type="radio" id="q1-star4half" name="rating1" value="4.5" />
          <label class="half" for="q1-star4half" title="Pretty good - 4.5 stars"></label>

          <input type="radio" id="q1-star4" name="rating1" value="4" />
          <label class="full" for="q1-star4" title="Pretty good - 4 stars"></label>

          <input type="radio" id="q1-star3half" name="rating1" value="3.5" />
          <label class="half" for="q1-star3half" title="Meh - 3.5 stars"></label>

          <input type="radio" id="q1-star3" name="rating1" value="3" />
          <label class="full" for="q1-star3" title="Meh - 3 stars"></label>

          <input type="radio" id="q1-star2half" name="rating1" value="2.5" />
          <label class="half" for="q1-star2half" title="Kinda bad - 2.5 stars"></label>

          <input type="radio" id="q1-star2" name="rating1" value="2" />
          <label class="full" for="q1-star2" title="Kinda bad - 2 stars"></label>

          <input type="radio" id="q1-star1half" name="rating1" value="1.5" />
          <label class="half" for="q1-star1half" title="Meh - 1.5 stars"></label>

          <input type="radio" id="q1-star1" name="rating1" value="1" />
          <label class="full" for="q1-star1" title="Sucks big time - 1 star"></label>

          <input type="radio" id="q1-starhalf" name="rating1" value="0.5" />
          <label class="half" for="q1-starhalf" title="Sucks big time - 0.5 stars"></label>
        </fieldset>

        <fieldset class="rating texto-alt">
          <legend>Pregunta 2</legend>
          <input type="radio" id="q2-star5" name="rating2" value="5" />
          <label class="full" for="q2-star5" title="Awesome - 5 stars"></label>

          <input type="radio" id="q2-star4half" name="rating2" value="4.5" />
          <label class="half" for="q2-star4half" title="Pretty good - 4.5 stars"></label>

          <input type="radio" id="q2-star4" name="rating2" value="4" />
          <label class="full" for="q2-star4" title="Pretty good - 4 stars"></label>

          <input type="radio" id="q2-star3half" name="rating2" value="3.5" />
          <label class="half" for="q2-star3half" title="Meh - 3.5 stars"></label>

          <input type="radio" id="q2-star3" name="rating2" value="3" />
          <label class="full" for="q2-star3" title="Meh - 3 stars"></label>

          <input type="radio" id="q2-star2half" name="rating2" value="2.5" />
          <label class="half" for="q2-star2half" title="Kinda bad - 2.5 stars"></label>

          <input type="radio" id="q2-star2" name="rating2" value="2" />
          <label class="full" for="q2-star2" title="Kinda bad - 2 stars"></label>

          <input type="radio" id="q2-star1half" name="rating2" value="1.5" />
          <label class="half" for="q2-star1half" title="Meh - 1.5 stars"></label>

          <input type="radio" id="q2-star1" name="rating2" value="1" />
          <label class="full" for="q2-star1" title="Sucks big time - 1 star"></label>

          <input type="radio" id="q2-starhalf" name="rating2" value="0.5" />
          <label class="half" for="q2-starhalf" title="Sucks big time - 0.5 stars"></label>
        </fieldset>

        <fieldset class="rating texto-alt">
          <legend>Pregunta 3</legend>
          <input type="radio" id="q3-star5" name="rating3" value="5" />
          <label class="full" for="q3-star5" title="Awesome - 5 stars"></label>

          <input type="radio" id="q3-star4half" name="rating3" value="4.5" />
          <label class="half" for="q3-star4half" title="Pretty good - 4.5 stars"></label>

          <input type="radio" id="q3-star4" name="rating3" value="4" />
          <label class="full" for="q3-star4" title="Pretty good - 4 stars"></label>

          <input type="radio" id="q3-star3half" name="rating3" value="3.5" />
          <label class="half" for="q3-star3half" title="Meh - 3.5 stars"></label>

          <input type="radio" id="q3-star3" name="rating3" value="3" />
          <label class="full" for="q3-star3" title="Meh - 3 stars"></label>

          <input type="radio" id="q3-star2half" name="rating3" value="2.5" />
          <label class="half" for="q3-star2half" title="Kinda bad - 2.5 stars"></label>

          <input type="radio" id="q3-star2" name="rating3" value="2" />
          <label class="full" for="q3-star2" title="Kinda bad - 2 stars"></label>

          <input type="radio" id="q3-star1half" name="rating3" value="1.5" />
          <label class="half" for="q3-star1half" title="Meh - 1.5 stars"></label>

          <input type="radio" id="q3-star1" name="rating3" value="1" />
          <label class="full" for="q3-star1" title="Sucks big time - 1 star"></label>

          <input type="radio" id="q3-starhalf" name="rating3" value="0.5" />
          <label class="half" for="q3-starhalf" title="Sucks big time - 0.5 stars"></label>
        </fieldset>

        <button type="submit" class="titulo-subtitulo" id="btn-enviar-calificacion">Enviar</button>
      </form>
  `;
  document.getElementById('encuesta-form').addEventListener('submit', enviarCalificacion);
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

// Envio de calificaciones
async function enviarCalificacion(e) {
  e.preventDefault();
  const btnEnviar = document.getElementById('btn-enviar-calificacion');
  btnEnviar.disabled = true;
  btnEnviar.textContent = 'Enviando...';

  // Captura los valores seleccionados
  const data = {
    rating1: document.querySelector('input[name="rating1"]:checked')?.value,
    rating2: document.querySelector('input[name="rating2"]:checked')?.value,
    rating3: document.querySelector('input[name="rating3"]:checked')?.value,
  };

  // Envía al backend
  const res = await fetch('/ratings/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  alert(result.message);
  const ratingContainer = document.getElementById('rating-section');
  ratingContainer.innerHTML = '<h3 class="titulo-subtitulo">¡Gracias por tu calificación!</h3>';
}

// Verificar datos al cargar la página
document.addEventListener('DOMContentLoaded', verificarDatosUsuario);
