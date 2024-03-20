let handModel;
let isModelReady = false;
let video;
let upArrow, downArrow, leftArrow, rightArrow;

function preload() {
  // Cargar las imágenes de las flechas
  upArrow = loadImage('assets/up.png');
  downArrow = loadImage('assets/down.png');
  leftArrow = loadImage('assets/left.png');
  rightArrow = loadImage('assets/right.png');
}

function setup() {
  const canvas = createCanvas(640, 480);
  canvas.parent('canvas-container');

  // Cargar el modelo de Teachable Machine
  handModel = ml5.imageClassifier('https://teachablemachine.withgoogle.com/models/Jm57J_YEn/', modelLoaded);

  // Configurar la cámara de video
  const videoOptions = {
    video: {
      facingMode: "user"
    }
  };
  video = createCapture(videoOptions);
  video.size(width, height);
  video.hide();

  // Inicializar el modelo de Teachable Machine
  handModel.classify(video, gotResult);
}

function modelLoaded() {
  console.log('Modelo de Teachable Machine cargado.');
  isModelReady = true;
}

function gotResult(error, results) {
  if (error) {
    console.error(error);
    return;
  }

  // Verificar si se recibieron resultados
  if (!results || results.length === 0) {
    console.error('No se recibieron resultados de clasificación.');
    return;
  }

  // Obtener la etiqueta con mayor probabilidad
  const label = results[0].label;

  // Mostrar la imagen correspondiente al gesto clasificado
  clear();
  if (label === 'Up') {
    image(upArrow, 0, 0, width, height);
  } else if (label === 'Down') {
    image(downArrow, 0, 0, width, height);
  } else if (label === 'Left') {
    image(leftArrow, 0, 0, width, height);
  } else if (label === 'Right') {
    image(rightArrow, 0, 0, width, height);
  }

  // Volver a clasificar la imagen para obtener un control continuo
  handModel.classify(video, gotResult);
}
