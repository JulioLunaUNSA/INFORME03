class Point {
   constructor(x, y, userData) {
      this.x = x;
      this.y = y;
      this.userData = userData;
   }
}
  
class Rectangle {
   constructor(x, y, w, h) {
      this.x = x; //center
      this.y = y;
      this.w = w; //half width
      this.h = h; //half height
   }

   //TRABAJO
   // verifica si este objeto contiene un objeto Punto
   contains(point) {
      if (point.x >= (this.x - this.w) &&
          point.x < (this.x + this.w) &&
          point.y >= (this.y - this.h) &&
          point.y < (this.y + this.h))
         return true;
      return false;
   }
  
   //TRABAJO
   // verifica si este objeto se intersecta con otro objeto Rectangle
   intersects(range) {
      return !(
         range.x - range.w > this.x + this.w ||
         range.x + range.w < this.x - this.w ||
         range.y - range.h > this.y + this.h ||
         range.y + range.h < this.y - this.h
      );
   }
}
  
class QuadTree {
   constructor(boundary, n) {
      this.boundary = boundary; //Rectangle
      this.capacity = n; // capacidad maxima de cada cuadrante
      this.points = []; // vector donde almacena los puntos
      this.divided = false;
      this.northeast = null;
      this.northwest = null;
      this.southeast = null;
      this.southwest = null;
   }
  
   //TRABAJO
   // divide el quadtree en 4 quadtrees
   subdivide() {
      let x = this.boundary.x;
      let y = this.boundary.y;
      let w = this.boundary.w;
      let h = this.boundary.h;

      let qt_northeast = new Rectangle(x + (w / 2), y + (h / 2), w / 2, h / 2);
      let qt_northwest = new Rectangle(x - (w / 2), y + (h / 2), w / 2, h / 2);
      let qt_southeast = new Rectangle(x + (w / 2), y - (h / 2), w / 2, h / 2);
      let qt_southwest = new Rectangle(x - (w / 2), y - (h / 2), w / 2, h / 2);

      this.northeast = new QuadTree(qt_northeast, this.capacity);
      this.northwest = new QuadTree(qt_northwest, this.capacity);
      this.southeast = new QuadTree(qt_southeast, this.capacity);
      this.southwest = new QuadTree(qt_southwest, this.capacity);

      this.divided = true;
   }
  
   //TRABAJO
   insert(point) {
      if (!this.boundary.contains(point)) {
         return false;
      }

      if (this.points.length < this.capacity && !this.divided) {
         this.points.push(point);
         return true;
      } else {
         if (!this.divided) {
            this.subdivide();
         }
         this.points.push(point);
         let points = this.points.slice();
         for (let p of points) {
            this.points.shift();
            if (this.northeast.insert(p)) continue;
            if (this.northwest.insert(p)) continue;
            if (this.southeast.insert(p)) continue;
            if (this.southwest.insert(p)) continue;
         }
         return true;
      }
   }
  
    //TRABAJO
    query(range, found) {
      if (!found) {
         found = [];
      }
      if (!this.boundary.intersects(range)) {
         return found;
      } else {
         if (!this.divided) {
            for (let p of this.points) {
               if (range.contains(p)) {
                  found.push(p);
               }
            }
         } else {
            found = this.northwest.query(range, found);
            found = this.northeast.query(range, found);
            found = this.southwest.query(range, found);
            found = this.southeast.query(range, found);
         }
      }
      return found;
    }
  
  
   show() {
      stroke(255);
      strokeWeight(1);
      noFill();
      rectMode(CENTER);
      rect(this.boundary.x, this.boundary.y, this.boundary.w*2, this.boundary.h*2);
  
      if (this.divided) {
         this.northeast.show();
         this.northwest.show();
         this.southeast.show();
         this.southwest.show();
      }

      for (let p of this.points) {
         strokeWeight(4);
         point(p.x, p.y);
      }
   }
}
