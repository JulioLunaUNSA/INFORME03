let qt;
let count = 0;

// PUNTO 04
/*
function setup() {
   createCanvas(400, 400);
   // centre point and half of width and height
   let boundary = new Rectangle(200, 200, 200, 200);
 
   // each leave just could have 4 elements
   qt = new QuadTree(boundary, 4);
 
   console.log(qt);

   for (let i=0; i < 3; i++) {
      let p = new Point(Math.random() * 400, Math.random() * 400);
      qt.insert(p);
   }

   background(0);
   qt.show();
}
*/

// PUNTO 06
/*
function setup() {
   createCanvas(400, 400);
   let boundary = new Rectangle(200, 200, 200, 200);
   qt = new QuadTree(boundary, 4);
}

function draw() {
   background(0);
   if (mouseIsPressed) {
      for (let i = 0; i < 1; i++) {
         let m = new Point(mouseX + random(-5 ,5), mouseY + random(-5 ,5));
         qt.insert(m);
      }
   }
   background(0);
   qt.show();
}
*/

// PUNTO 08
function setup(){
   createCanvas(400, 400);
   let boundary = new Rectangle(200, 200, 200, 200);
   qt = new QuadTree(boundary, 4);

   console.log(qt);
   for (let i=0; i < 40; i++) {
      let p = new Point(Math.random() * 400, Math.random() * 400);
      qt.insert(p);
   }
   background(0);
   qt.show();
}

function draw() {
   background(0);
   qt.show();

   stroke(0, 255, 0);
   rectMode(CENTER);
   let range = new Rectangle(mouseX, mouseY, 50, 50)
   rect(range.x, range.y, range.w*2, range.h*2);
   let points = [];
   points = qt.query(range, points);
   for (let p of points) {
      strokeWeight(4);
      point(p.x, p.y);
   }
}
