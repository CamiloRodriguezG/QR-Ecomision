const formIngreso = document.querySelector(".form-ingreso");
const formDatosPersonales = document.getElementById("form-datos-personales");
const nombreInput = document.getElementById("nombre");
const apellidoInput = document.getElementById("apellido");
const numeroPregunta = document.getElementById("numero-pregunta");
const textoBienvenida = document.querySelector(".texto-bienvenida");
const formContainer = document.getElementById("form-container");
const preguntas = document.querySelectorAll(".pregunta-contenedor");
const btnAnterior = document.getElementById("anterior-btn");
const btnSiguiente = document.getElementById("siguiente-btn");
const opcionesPreguntas = document.querySelectorAll(".opcion-pregunta");
const numeroUsuarios = document.getElementById("numero-usuarios");
const barraAvance = document.querySelector(".barra-avance");

let preguntasTotales = preguntas.length;
let indiceActual = 0;
let usuariosConectados = 0;
let avance = 0;
const socket = io();

// Evento para el formulario de ingreso
formDatosPersonales.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = nombreInput.value.trim();
  const apellido = apellidoInput.value.trim();

  if (nombre && apellido) {
    // Guardar los datos del usuario (puedes expandir esto según necesites)
    localStorage.setItem("usuarioNombre", nombre);
    localStorage.setItem("usuarioApellido", apellido);

    // Ocultar el formulario de ingreso
    formIngreso.classList.add("oculto");

    // Iniciar el test
    iniciarTest();
  }
});

socket.on("userCount", (cantidad) => {
  numeroUsuarios.style.opacity = "0";
  setTimeout(() => {
    numeroUsuarios.textContent = cantidad;
    numeroUsuarios.style.opacity = "1";
  }, 500);
});

opcionesPreguntas.forEach((op) => {
  op.addEventListener("click", () => {
    // Obtener el contenedor de opciones (ul) de la pregunta actual
    const contenedorOpciones = op.closest(".opciones-contenedor");

    contenedorOpciones
      .querySelectorAll(".opcion-pregunta")
      .forEach((opcion) => {
        opcion.classList.remove("opcion-seleccionada");
      });

    op.classList.add("opcion-seleccionada");
  });
});

function mostrarPregunta(nueva) {
  const preguntaActual = preguntas[indiceActual];
  preguntaActual.classList.remove("active");
  preguntaActual.classList.add(nueva > indiceActual ? "exit-up" : "exit-down");

  indiceActual = nueva;

  const siguiente = preguntas[indiceActual];
  siguiente.classList.remove("exit-up", "exit-down");
  siguiente.classList.add("active");

  btnAnterior.disabled = indiceActual === 0;
  if (indiceActual === 0) {
    btnAnterior.classList.add("btn-desactivado");
  } else {
    btnAnterior.classList.remove("btn-desactivado");
  }

  if (indiceActual === preguntas.length - 1) {
    btnSiguiente.textContent = "Finalizar";
    btnSiguiente.style.background = "var(--color-azul)";
  } else {
    btnSiguiente.textContent = "Siguiente";
    btnSiguiente.style.background = "";
  }

  avance = (indiceActual * 100) / preguntasTotales;
  barraAvance.style.width = `${avance}%`;
}

btnSiguiente.addEventListener("click", () => {
  const preguntaActual = preguntas[indiceActual];

  // Verificar si hay alguna opción seleccionada en la pregunta actual
  const opcionSeleccionada = preguntaActual.querySelector(
    ".opcion-seleccionada"
  );

  if (!opcionSeleccionada) {
    // Obtener el contenedor de opciones y activar la animación de terremoto
    const contenedorOpciones = preguntaActual.querySelector(
      ".opciones-contenedor"
    );
    contenedorOpciones.classList.add("terremoto");

    // Remover la clase después de que termine la animación
    setTimeout(() => {
      contenedorOpciones.classList.remove("terremoto");
    }, 1000);

    return;
  }

  if (indiceActual < preguntas.length - 1) {
    mostrarPregunta(indiceActual + 1);
    numeroPregunta.textContent = `Pregunta No. ${indiceActual + 1}`;
  } else {
    let opcionesSeleccionadas = [];
    opcionesPreguntas.forEach((op) => {
      if (op.classList.contains("opcion-seleccionada")) {
        opcionesSeleccionadas.push(op.textContent);
      }
    });
    const nombre = localStorage.getItem("usuarioNombre");
    const apellido = localStorage.getItem("usuarioApellido");
    const opciones = "";
    alert(
      `Usuario ${nombre} ${apellido} con siguientes ocpiones\n${opcionesSeleccionadas}`
    );
    formContainer.style.display = "none";
    // Logica de mostrar personaje
  }
});

btnAnterior.addEventListener("click", () => {
  if (indiceActual > 0) {
    mostrarPregunta(indiceActual - 1);
    numeroPregunta.textContent = `Pregunta No. ${indiceActual + 1}`;
  }
});

// Función para iniciar el test
function iniciarTest() {
  const nombre = localStorage.getItem("usuarioNombre");
  textoBienvenida.textContent = `Bienvenido ${nombre}, descubramos que guardian verde eres`;
  // Mostrar la primera pregunta
  preguntas[0].classList.add("active");
  numeroPregunta.textContent = "Pregunta No. 1";
}

// Función para verificar si ya existen datos del usuario
function verificarDatosUsuario() {
  const nombre = localStorage.getItem("usuarioNombre");
  const apellido = localStorage.getItem("usuarioApellido");

  if (nombre && apellido) {
    // Si ya existen los datos, ocultar el formulario y iniciar el test
    formIngreso.classList.add("oculto");
    iniciarTest();
  }
}

// Verificar datos al cargar la página
document.addEventListener("DOMContentLoaded", verificarDatosUsuario);
