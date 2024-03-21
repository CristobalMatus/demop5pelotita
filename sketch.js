let video;
let classifier;
let resultsP;
//let modelo = 'https://teachablemachine.withgoogle.com/models/ltfG62v04/';
//let modelo = 'https://teachablemachine.withgoogle.com/models/2TFpRc6ZR/';
let modelo = 'https://teachablemachine.withgoogle.com/models/YCq9OpgDv/'

let engine = Matter.Engine.create();

let render = Matter.Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: 800,
    height: 600,
  }
});

let mouse = Matter.Mouse.create(render.canvas);
let mouseConstraint = Matter.MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    render: { visible: false }
  }
});

let ground = Matter.Bodies.rectangle(400, 600, 810, 60, { isStatic: true });

let stack2 = Matter.Composites.stack(400, 300, 4, 4, 0, 0, function (x, y) {
  return Matter.Bodies.polygon(x, y, 8, 30);
});

let ball = Matter.Bodies.circle(200, 400, 20);

let sling = Matter.Constraint.create({
  pointA: { x: 200, y: 400 },
  bodyB: ball,
  stiffness: 0.005
});


Matter.World.add(engine.world, [ball, stack2, ground, mouseConstraint]);
Matter.Engine.run(engine);
Matter.Render.run(render);

function preload() {
  classifier = ml5.imageClassifier(modelo, modelReady)
  resultsP = createP('loading model and video...');
}

function setup() {
  createCanvas(640, 640);
  video = createCapture(VIDEO);
  video.hide();
  
}

function draw() {
  background(0);
  image(video, 0, 0);
}

function modelReady() {
  console.log('Model Ready');
  classifyVideo();
}

function classifyVideo() {
  classifier.classify(video, gotResult);
}

function gotResult(error, results) {
  if (error) {
    console.error(error);
    return;
  }

  const label = results[0].label;
  const confidence = results[0].confidence;
  
  resultsP.html(`Label: ${label}<br>Confianza: ${confidence}`);

  if (confidence >= 0.8) {
    if (label === 'Girar') {
      Matter.Body.setVelocity(ball, { x: ball.velocity.x, y: -3 });
    } else if (label === 'Reducir') {
      Matter.Body.translate(ball, { x: -10, y: 0 });
    } else if (label === 'Aumentar') {
      Matter.Body.translate(ball, { x: 10, y: 0 });
    } else if (label === 'Disparar') {
      Matter.Body.setVelocity(ball, { x: ball.velocity.x, y: 3 });
    }
  }
  classifyVideo();
}
