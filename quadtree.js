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
    // verificia si este objeto contiene un objeto Punto
    contains(point) {
        if (point.x >= (this.x - this.w) && point.x < (this.x + this.w) && point.y >= (this.y - this.h) && point.y < (this.y + this.h))
            return true;
        return false;
    }
  
    //TRABAJO
    // verificia si este objeto se intersecta con otro objeto Rectangle
    intersects(range) {
        var punto1 = new Point(range.x - range.w, range.y - range.h);
        var punto2 = new Point(range.x - range.w, range.y + range.h);
        var punto3 = new Point(range.x + range.w, range.y - range.h);
        var punto4 = new Point(range.x + range.w, range.y + range.h);
        if (this.contains(punto1)) return true;
        if (this.contains(punto2)) return true;
        if (this.contains(punto3)) return true;
        if (this.contains(punto4)) return true;
        return false;
    }
  }
  
  class QuadTree {
    constructor(boundary, n) {
      this.boundary = boundary; //Rectangle
      this.capacity = n; // capacidad maxima de cada cuadrante
      this.points = []; // vector donde almacena los puntos
      this.divided = false;
    }
  
    //TRABAJO
    // divide el quadtree en 4 quadtrees
    subdivide() {
        let x = this.boundary.x;
        let y = this.boundary.y;
        let w = this.boundary.w;
        let h = this.boundary.h;

        let qt_northeast = new Rectangle(x + w / 2, y + h / 2, w / 2, h / 2);
        let qt_northwest = new Rectangle(x - w / 2, y + h / 2, w / 2, h / 2);
        let qt_southeast = new Rectangle(x + w / 2, y - h / 2, w / 2, h / 2);
        let qt_southwest = new Rectangle(x - w / 2, y - h / 2, w / 2, h / 2);

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
  
      if (this.points.length < this.capacity) {
        this.points.push(point);
        return true;
      } else {
        if (!this.divided) {
          this.subdivide();
        }
        if (this.northeast.insert(point)) {
          return true;
        } else if (this.northwest.insert(point)) {
          return true;
        } else if (this.southeast.insert(point)) {
          return true;
        } else if (this.southwest.insert(point)) {
          return true;
        }
      }
    }
  
    //TRABAJO
    query(range, found) {
      if (!found) {
        found = [];
      }
      if (!this.boundary.intersects(range)) {
        return;
      } else {
        for (let p of this.points) {
          if (range.contains(p)) {
            found.push(p);
          }
        }
        if (this.divided) {
          this.northwest.query(range, found);
          this.northeast.query(range, found);
          this.southwest.query(range, found);
          this.southeast.query(range, found);
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
