let video;
let classifier;
let resultsP;
let modelo = 'https://teachablemachine.withgoogle.com/models/ltfG62v04/';

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
  resultsP = createP('loading model andf video...');
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

  if (label === 'girar') {
    Matter.Body.setVelocity(ball, { x: ball.velocity.x, y: -3 });

  } else if (label === 'reducir') {
    Matter.Body.translate(ball, { x: -10, y: 0 });
  } else if (label === 'aumentar') {
    Matter.Body.translate(ball, { x: 10, y: 0 });
  } else if (label === 'disparar') {
    Matter.Body.setVelocity(ball, { x: ball.velocity.x, y: 3 });
  }

  classifyVideo();
}
