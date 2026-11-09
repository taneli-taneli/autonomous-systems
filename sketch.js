
// UNDERWATER DREAM
// Generative Riso-inspired underwater illustration
// Click = regenerate | SPACE = regenerate | S = save

let midnight, teal, yellow, pink, mist, fishInk, faceInk;
let sceneSeed;
let coralPlants = [];
let rocks = [];
let bubbles = [];

function setup() {
  createCanvas(500, 300);

  pixelDensity(1);

  // Riso ink layers
  midnight = new Riso("MIDNIGHT");
  teal = new Riso("TEAL");
  yellow = new Riso("SUNFLOWER");
  pink = new Riso("FLUORESCENTPINK");
  mist = new Riso("MIST");
  fishInk = new Riso("BRIGHTRED");
  faceInk = new Riso("BISQUE");

  regenerate();
}

function regenerate() {
  sceneSeed = floor(random(100000));
  randomSeed(sceneSeed);
  noiseSeed(sceneSeed);

  coralPlants = [];
  rocks = [];
  bubbles = [];

  // Generate underwater plants
  for (let i = 0; i < 9; i++) {
    coralPlants.push({
      x: random(-20, width + 20),
      y: random(85, 145),
      h: random(25, 65),
      branches: floor(random(3, 7)),
      bend: random(-20, 20)
    });
  }

  // Generate seafloor rocks
  for (let i = 0; i < 45; i++) {
    rocks.push({
      x: random(width),
      y: random(160, 290),
      size: random(3, 13)
    });
  }

  // Generate floating bubbles
  for (let i = 0; i < 22; i++) {
    bubbles.push({
      x: random(240, 490),
      y: random(30, 270),
      size: random(3, 13),
      speed: random(0.3, 1.1),
      offset: random(TWO_PI)
    });
  }
}

function draw() {
  background(245);

  randomSeed(sceneSeed);

  clearRiso();

  drawBackground();
  drawCompanionFishSchool();
  drawWaterPlants();
  drawSeafloor();
  drawCoral();
  drawCreature();
  drawBubbles();
  drawPrintTexture();

  // Combine ink layers
  drawRiso();
  pixelateCanvas(5);
}

function pixelateCanvas(pixelSize) {
  const pixelated = get();
  pixelated.resize(
    Math.max(1, Math.ceil(width / pixelSize)),
    Math.max(1, Math.ceil(height / pixelSize))
  );

  noSmooth();
  image(pixelated, 0, 0, width, height);
  smooth();
}

// -------------------------
// BACKGROUND
// -------------------------

function drawBackground() {
  midnight.noStroke();
  midnight.fill(80);
  midnight.rect(0, 0, width, height);
  midnight.fill(70);
  midnight.rect(0, 0, width, 125);

  // Deep water vertical light rays
  teal.noStroke();

  for (let i = 0; i < 12; i++) {
    let x = i * 48 + noise(i * 0.4) * 20;
    let w = random(8, 25);

    teal.fill(random(35, 85));
    teal.beginShape();
    teal.vertex(x, 0);
    teal.vertex(x + w, 0);
    teal.vertex(x + w + 30, 120);
    teal.vertex(x - 15, 120);
    teal.endShape(CLOSE);
  }

  // Distant underwater formations
  for (let i = 0; i < 9; i++) {
    let x = i * 65 + 10;
    let h = random(30, 85);

    teal.fill(90);
    teal.ellipse(x, 65, 35, h);
  }

  // Soft water texture
  for (let i = 0; i < 500; i++) {
    let x = random(width);
    let y = random(10, 150);

    let n = noise(x * 0.025, y * 0.025);

    if (n > 0.52) {
      teal.fill(random(25, 75));
      teal.ellipse(x, y, random(1, 3));
    }
  }
}

function drawCompanionFishSchool() {
  for (let i = 0; i < 2; i++) {
    const x = (frameCount * 0.55 + i * 255) % (width + 50) - 25;
    const y = i === 0 ? 48 : 88;

    fishInk.push();
    fishInk.translate(x, y);
    faceInk.push();
    faceInk.translate(x, y);
    midnight.push();
    midnight.translate(x, y);

    fishInk.noStroke();
    fishInk.fill(255);
    fishInk.ellipse(0, 0, 20, 13);
    fishInk.beginShape();
    fishInk.vertex(-8, 0);
    fishInk.vertex(-17, -7);
    fishInk.vertex(-15, 0);
    fishInk.vertex(-17, 7);
    fishInk.endShape(CLOSE);

    faceInk.noStroke();
    faceInk.fill(255);
    faceInk.ellipse(6, -1, 10, 11);

    midnight.noStroke();
    midnight.fill(255);
    midnight.ellipse(8, -3, 2, 2);

    fishInk.pop();
    faceInk.pop();
    midnight.pop();
  }
}

// -------------------------
// SEAWEED
// -------------------------

function drawWaterPlants() {
  for (let plant of coralPlants) {
    teal.noFill();
    teal.stroke(255);
    teal.strokeWeight(2);

    for (let b = 0; b < plant.branches; b++) {
      let x = plant.x + b * 5 - plant.branches * 2;

      let movement = sin(frameCount * 0.015 + b) * 3;

      teal.bezier(
        x, 145,
        x - 10, 130,
        x + plant.bend + movement, 100,
        x + plant.bend + movement, 145 - plant.h
      );
    }
  }
}

// -------------------------
// SEAFLOOR
// -------------------------

function drawSeafloor() {
  yellow.noStroke();
  yellow.fill(255);

  yellow.beginShape();
  yellow.vertex(0, 125);
  yellow.vertex(width, 125);

  for (let x = width; x >= 0; x -= 10) {
    let y = 130 + noise(x * 0.025) * 12;
    yellow.vertex(x, y);
  }

  yellow.vertex(0, height);
  yellow.endShape(CLOSE);

  // Organic sand texture
  for (let i = 0; i < 1800; i++) {
    let x = random(width);
    let y = random(135, height);

    let n = noise(x * 0.035, y * 0.035);

    yellow.fill(random(60, 180));
    yellow.ellipse(
      x,
      y,
      random(1, 4) * n + 1,
      random(1, 3)
    );
  }

  // Small stones
  for (let rock of rocks) {
    yellow.noStroke();
    yellow.fill(170);
    yellow.ellipse(
      rock.x,
      rock.y,
      rock.size,
      rock.size * 0.65
    );

    teal.noFill();
    teal.stroke(160);
    teal.strokeWeight(1);
    teal.ellipse(
      rock.x,
      rock.y,
      rock.size,
      rock.size * 0.65
    );
  }

  // Small sea grass
  for (let i = 0; i < 28; i++) {
    let x = random(width);
    let y = random(165, 295);

    teal.noFill();
    teal.stroke(255);
    teal.strokeWeight(1);

    for (let j = 0; j < 4; j++) {
      teal.bezier(
        x, y,
        x - 8, y - 12,
        x + random(-10, 10), y - 20,
        x + random(-12, 12), y - random(15, 28)
      );
    }
  }
}

// -------------------------
// CORAL
// -------------------------

function drawCoral() {
  let coralLocations = [
    [15, 130],
    [430, 137],
    [480, 135]
  ];

  for (let c of coralLocations) {
    let x = c[0];
    let y = c[1];

    pink.noStroke();
    pink.fill(255);

    // Coral base
    pink.ellipse(x, y, 35, 15);

    // Branches
    for (let i = 0; i < 7; i++) {
      let angle = map(i, 0, 6, -1.3, 1.3);
      let len = random(20, 48);

      pink.stroke(255);
      pink.strokeWeight(random(2, 5));
      pink.noFill();

      pink.line(
        x, y,
        x + sin(angle) * len,
        y - cos(angle) * len
      );

      pink.noStroke();
      pink.ellipse(
        x + sin(angle) * len,
        y - cos(angle) * len,
        4, 4
      );
    }
  }
}

// -------------------------
// SWIMMING FISH
// -------------------------

function drawCreature() {
  // Swim smoothly across the canvas, carrying the fish's bubble with it.
  const fishX = (frameCount * 0.7 + width / 2 + 80) % (width + 160) - 80;
  const swimOffset = fishX - 250;
  const swimBob = sin(frameCount * 0.06) * 4;

  midnight.push();
  midnight.translate(swimOffset, swimBob);
  teal.push();
  teal.translate(swimOffset, swimBob);
  mist.push();
  mist.translate(swimOffset, swimBob);
  pink.push();
  pink.translate(swimOffset, swimBob);
  fishInk.push();
  fishInk.translate(swimOffset, swimBob);
  faceInk.push();
  faceInk.translate(swimOffset, swimBob);

  // Large transparent bubble
  mist.noFill();
  mist.stroke(255);
  mist.strokeWeight(3);
  mist.ellipse(250, 165, 142, 132);

  teal.stroke(130);
  teal.strokeWeight(1);
  teal.arc(250, 165, 142, 132, PI, TWO_PI);

  // Bubble highlight
  mist.noFill();
  mist.stroke(255);
  mist.strokeWeight(3);
  mist.arc(250, 165, 126, 119, PI + 0.2, PI + 1.4);

  mist.strokeWeight(2);
  mist.arc(250, 165, 132, 125, 0.2, 0.8);

  // Creature shadow
  midnight.noStroke();
  midnight.fill(150);
  midnight.ellipse(252, 185, 75, 13);

  // Fish body
  fishInk.noStroke();
  fishInk.fill(255);

  fishInk.beginShape();
  fishInk.vertex(210, 160);
  fishInk.bezierVertex(197, 145, 205, 132, 221, 135);
  fishInk.bezierVertex(232, 127, 244, 134, 250, 141);
  fishInk.bezierVertex(244, 151, 244, 165, 251, 176);
  fishInk.bezierVertex(239, 185, 223, 181, 210, 172);
  fishInk.bezierVertex(205, 168, 205, 163, 210, 160);
  fishInk.endShape(CLOSE);

  // Tail fin
  fishInk.beginShape();
  fishInk.vertex(211, 157);
  fishInk.vertex(196, 143);
  fishInk.vertex(200, 162);
  fishInk.vertex(193, 179);
  fishInk.vertex(215, 173);
  fishInk.endShape(CLOSE);

  // Face / head
  faceInk.noStroke();
  faceInk.fill(255);

  faceInk.beginShape();
  faceInk.vertex(236, 146);
  faceInk.bezierVertex(238, 129, 254, 124, 268, 135);
  faceInk.bezierVertex(283, 143, 285, 160, 277, 171);
  faceInk.bezierVertex(269, 183, 250, 181, 240, 172);
  faceInk.bezierVertex(230, 166, 229, 155, 236, 146);
  faceInk.endShape(CLOSE);

  // Face outline
  midnight.noFill();
  midnight.stroke(255);
  midnight.strokeWeight(1.5);
  midnight.arc(259, 157, 43, 41, -0.3, PI + 0.2);

  // Small, dark eye like the reference fish
  midnight.noStroke();
  midnight.fill(255);
  midnight.ellipse(268, 151, 5, 5);

  // Small mouth
  pink.stroke(255);
  pink.strokeWeight(2);
  pink.noFill();
  pink.arc(273, 163, 7, 5, 0, PI);

  // Little fins
  fishInk.noStroke();
  fishInk.fill(220);

  fishInk.beginShape();
  fishInk.vertex(240, 173);
  fishInk.vertex(250, 188);
  fishInk.vertex(260, 176);
  fishInk.endShape(CLOSE);

  // Tiny cheek
  pink.fill(160);
  pink.ellipse(273, 169, 5, 3);

  midnight.pop();
  teal.pop();
  mist.pop();
  pink.pop();
  fishInk.pop();
  faceInk.pop();
}

// -------------------------
// FLOATING BUBBLES
// -------------------------

function drawBubbles() {
  for (let b of bubbles) {
    let x = b.x + sin(frameCount * 0.025 + b.offset) * 5;

    let y = (b.y - frameCount * b.speed) % 310;

    if (y < -10) y += 310;

    teal.noFill();
    teal.stroke(255);
    teal.strokeWeight(1.5);
    teal.ellipse(x, y, b.size, b.size);

    mist.noFill();
    mist.stroke(255);
    mist.strokeWeight(1);
    mist.arc(
      x - 1,
      y - 1,
      b.size * 0.6,
      b.size * 0.6,
      PI,
      TWO_PI
    );

    // Small bubble highlight
    mist.noStroke();
    mist.fill(255);
    mist.ellipse(
      x - b.size * 0.2,
      y - b.size * 0.2,
      2,
      2
    );
  }
}

// -------------------------
// RISO PRINT TEXTURE
// -------------------------

function drawPrintTexture() {
  // Grain on the entire composition
  randomSeed(sceneSeed + 10);

  for (let i = 0; i < 2600; i++) {
    let x = random(width);
    let y = random(height);

    let n = noise(x * 0.04, y * 0.04);

    if (random() > 0.5) {
      mist.noStroke();
      mist.fill(random(20, 80) * n);
      mist.ellipse(x, y, random(0.5, 1.5));
    }
  }

  // Halftone pattern
  for (let x = 5; x < width; x += 7) {
    for (let y = 5; y < height; y += 7) {
      let n = noise(x * 0.03, y * 0.03);

      if (n > 0.55) {
        midnight.noStroke();
        midnight.fill(65);
        midnight.ellipse(x, y, 1.2);
      }
    }
  }
}

// -------------------------
// INTERACTION
// -------------------------

function mousePressed() {
  regenerate();
}

function keyPressed() {
  if (key === ' ') {
    regenerate();
  }

  if (key === 's' || key === 'S') {
    saveCanvas("underwater-dream", "png");
  }
}
