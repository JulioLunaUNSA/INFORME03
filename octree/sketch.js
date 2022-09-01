let qt;
let count = 0;

function setup() {
  createCanvas(400, 400, WEBGL);
  // centre point and half of width and height
  let boundary = new Cube(200, 200, 200, 200, 200, 200);
  // each leave just could have 4 elements
  qt = new Octree(boundary, 4);

  console.log(qt);
  for (let i = 0; i < 9; i++) {
    let p = new Point(Math.random() * 50, Math.random() * 50, Math.random() * 50);
    qt.insert(p);
  }

  background(0);
  qt.show();
}

// function draw() {
//   background(0);
//   qt.show();

//   stroke(0, 255, 0);
//   let range = new Cube(mouseX, mouseY, mouseX);
//   console.log(range.x, range.y);
//   box(range.x, range.y, range.w, range.h);
//   let points = qt.query(range);

//   // for (let p of points) {
//   //   strokeWeight(4);
//   //   point(p.x, p.y);
//   // }
// }
