const residuos = [
  { nombre: 'Botella de vidrio', icono: 'wine-bottle', color: '#2E8B57', caneca: 'blanca' },
  { nombre: 'Cáscara de plátano', icono: 'apple-alt', color: '#FFD700', caneca: 'verde' },
  { nombre: 'Papel', icono: 'sticky-note', color: '#1E90FF', caneca: 'blanca' },
  { nombre: 'Papel sucio', icono: 'toilet-paper', color: '#8B4513', caneca: 'negra' },
  { nombre: 'Envase de plástico', icono: 'bottle-water', color: '#FF4500', caneca: 'blanca' },
  { nombre: 'Aguja hipodérmica', icono: 'syringe', color: '#8B0000', caneca: 'roja' },
];
const canecas = [
  {
    nombre: 'Caneca Blanca',
    id: 'blanca',
    color: '#ffffff',
    imagen: '../img/juego/basura_blanca.png',
  },
  {
    nombre: 'Caneca Verde',
    id: 'verde',
    color: '#2E8B57',
    imagen: '../img/juego/basura_verde.png',
  },
  { nombre: 'Caneca Roja', id: 'roja', color: '#FF0000', imagen: '../img/juego/basura_roja.png' },
  {
    nombre: 'Caneca Negra',
    id: 'negra',
    color: '#000000',
    imagen: '../img/juego/basura_negra.png',
  },
];

let correct = 0;
let total = 0;
const totalDraggableItems = 5;
const totalMatchingPairs = 5; // Should be <= totalDraggableItems

const scoreSection = document.querySelector('.score');
const correctSpan = scoreSection.querySelector('.correct');
const totalSpan = scoreSection.querySelector('.total');
const playAgainBtn = scoreSection.querySelector('#play-again-btn');

const draggableItems = document.querySelector('.draggable-items');
const matchingPairs = document.querySelector('.matching-pairs');
let draggableElements;
let droppableElements;

initiateGame();

function initiateGame() {
  const randomResiduos = generateRandomItemsArray(totalDraggableItems, residuos);

  for (let i = 0; i < randomResiduos.length; i++) {
    draggableItems.insertAdjacentHTML(
      'beforeend',
      `
      <div class="draggable-wrapper">
        <i class="fas fa-${randomResiduos[i].icono} draggable" 
           draggable="true" 
           style="color:${randomResiduos[i].color};"
           id="residuo-${i}"
           data-caneca="${randomResiduos[i].caneca}">
        </i>
        <span class="draggable-name titulo-subtitulo">${randomResiduos[i].nombre}</span>
      </div>
    `
    );
  }

  // Create "matching-pairs" and append to DOM
  /*
  for(let i=0; i<alphabeticallySortedRandomDroppableBrands.length; i++) {
    matchingPairs.insertAdjacentHTML("beforeend", `
      <div class="matching-pair">
        <span class="label">${alphabeticallySortedRandomDroppableBrands[i].brandName}</span>
        <span class="droppable" data-brand="${alphabeticallySortedRandomDroppableBrands[i].iconName}"></span>
      </div>
    `);
  }
  */
  // Crear las canecas
  for (let i = 0; i < canecas.length; i++) {
    matchingPairs.insertAdjacentHTML(
      'beforeend',
      `
    <div class="matching-pair">
      <img src="${canecas[i].imagen}" 
           class="droppable caneca" 
           data-caneca="${canecas[i].id}" 
           alt="${canecas[i].nombre}">
      <span class="label titulo-subtitulo">${canecas[i].nombre}</span>
    </div>
  `
    );
  }

  draggableElements = document.querySelectorAll('.draggable');
  droppableElements = document.querySelectorAll('.droppable');

  draggableElements.forEach((elem) => {
    elem.addEventListener('dragstart', dragStart);
    // elem.addEventListener("drag", drag);
    // elem.addEventListener("dragend", dragEnd);
  });

  droppableElements.forEach((elem) => {
    elem.addEventListener('dragenter', dragEnter);
    elem.addEventListener('dragover', dragOver);
    elem.addEventListener('dragleave', dragLeave);
    elem.addEventListener('drop', drop);
  });
}

// Drag and Drop Functions

//Events fired on the drag target

function dragStart(event) {
  event.dataTransfer.setData('text', event.target.id); // or "text/plain"
}

//Events fired on the drop target

function dragEnter(event) {
  if (
    event.target.classList &&
    event.target.classList.contains('droppable') &&
    !event.target.classList.contains('dropped')
  ) {
    event.target.classList.add('droppable-hover');
  }
}

function dragOver(event) {
  if (
    event.target.classList &&
    event.target.classList.contains('droppable') &&
    !event.target.classList.contains('dropped')
  ) {
    event.preventDefault();
  }
}

function dragLeave(event) {
  if (
    event.target.classList &&
    event.target.classList.contains('droppable') &&
    !event.target.classList.contains('dropped')
  ) {
    event.target.classList.remove('droppable-hover');
  }
}

function drop(event) {
  event.preventDefault();
  event.target.classList.remove('droppable-hover');

  const residuoId = event.dataTransfer.getData('text');
  const residuo = document.getElementById(residuoId);
  const canecaCorrecta = residuo.getAttribute('data-caneca');
  const canecaSeleccionada = event.target.getAttribute('data-caneca');

  total++;
  if (canecaCorrecta === canecaSeleccionada) {
    residuo.classList.add('dragged');
    residuo.setAttribute('draggable', 'false');
    correct++;
  }

  correctSpan.textContent = correct;
  totalSpan.textContent = total;

  if (correct === totalMatchingPairs) {
    playAgainBtn.style.display = 'block';
    setTimeout(() => {
      playAgainBtn.classList.add('play-again-btn-entrance');
    }, 200);
  }
}

// Other Event Listeners
playAgainBtn.addEventListener('click', playAgainBtnClick);
function playAgainBtnClick() {
  playAgainBtn.classList.remove('play-again-btn-entrance');
  correct = 0;
  total = 0;
  draggableItems.style.opacity = 0;
  matchingPairs.style.opacity = 0;
  setTimeout(() => {
    scoreSection.style.opacity = 0;
  }, 100);
  setTimeout(() => {
    playAgainBtn.style.display = 'none';
    while (draggableItems.firstChild) draggableItems.removeChild(draggableItems.firstChild);
    while (matchingPairs.firstChild) matchingPairs.removeChild(matchingPairs.firstChild);
    initiateGame();
    correctSpan.textContent = correct;
    totalSpan.textContent = total;
    draggableItems.style.opacity = 1;
    matchingPairs.style.opacity = 1;
    scoreSection.style.opacity = 1;
  }, 500);
}

// Auxiliary functions
function generateRandomItemsArray(n, originalArray) {
  let res = [];
  let clonedArray = [...originalArray];
  if (n > clonedArray.length) n = clonedArray.length;
  for (let i = 1; i <= n; i++) {
    const randomIndex = Math.floor(Math.random() * clonedArray.length);
    res.push(clonedArray[randomIndex]);
    clonedArray.splice(randomIndex, 1);
  }
  return res;
}
