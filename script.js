let engine;
let world;
let ball;

let handModel;
let isModelReady = false;

function setup() {
  const canvas = createCanvas(640, 480);
  canvas.parent('canvas-container');

  engine = Matter.Engine.create();
  world = engine.world;

  // Crear una pelota en el centro de la pantalla
  ball = new Ball(width / 2, height / 2);

  // Cargar el modelo de Teachable Machine
  handModel = ml5.imageClassifier('model.json', modelLoaded);

  // Configurar la cámara de video
  video = createCapture(VIDEO);
  video.size(width, height);

  // Inicializar el modelo de Teachable Machine
  handModel.classify(video, gotResult);

  // Ocultar el video
  video.hide();
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

  // Obtener la etiqueta con mayor probabilidad
  const label = results[0].label;

  // Realizar acciones según la etiqueta clasificada
  if (label === 'Rotate') {
    ball.rotate(); // Girar la pelota
  } else if (label === 'IncreasePower') {
    ball.increasePower(); // Aumentar la potencia
  } else if (label === 'DecreasePower') {
    ball.decreasePower(); // Reducir la potencia
  } else if (label === 'Shoot') {
    ball.shoot(); // Disparar la pelota
  }

  // Volver a clasificar la imagen para obtener un control continuo
  handModel.classify(video, gotResult);
}

function draw() {
  background(0);
  
  // Dibujar la pelota
  ball.show();

  // Actualizar el motor de física de Matter.js
  Matter.Engine.update(engine);
}

class Ball {
  constructor(x, y) {
    this.body = Matter.Bodies.circle(x, y, 20);
    Matter.World.add(world, this.body);
    this.color = color(255);
    this.power = 1; // Potencia inicial
  }

  rotate() {
    // Girar la pelota
    Matter.Body.rotate(this.body, 0.1);
  }

  increasePower() {
    // Aumentar la potencia
    this.power += 0.1;
  }

  decreasePower() {
    // Reducir la potencia
    if (this.power > 0) {
      this.power -= 0.1;
    }
  }

  shoot() {
    // Disparar la pelota con la potencia actual
    const forceMagnitude = 0.1 * this.power;
    const angle = this.body.angle;
    const forceX = forceMagnitude * cos(angle);
    const forceY = forceMagnitude * sin(angle);
    Matter.Body.applyForce(this.body, this.body.position, { x: forceX, y: forceY });
  }

  show() {
    fill(this.color);
    noStroke();
    let pos = this.body.position;
    ellipse(pos.x, pos.y, 40);
  }
}
