class Point {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

class Rectangle {
  constructor(x, y, w, h) {
    this.x = x; // center
    this.y = y;
    this.w = w; // half width
    this.h = h; // half height
  }
}

class Cube {
  constructor(x, y, z, w, h, v) {
    this.x = x; // center
    this.y = y;
    this.z = z;
    this.w = w; // half width
    this.h = h; // half height
    this.v = v;
  }

  contains(point) {
    return (
      point.x >= this.x - this.w &&
      point.x <= this.x + this.w &&
      point.y >= this.y - this.h &&
      point.y <= this.y + this.h &&
      point.z >= this.z - this.v &&
      point.z <= this.z + this.v
    );
  }

  intersects(range) {
    return !(
      range.x - range.w > this.x + this.w ||
      range.x + range.w < this.x - this.w ||
      range.y - range.h > this.y + this.h ||
      range.y + range.h < this.y - this.h ||
      range.z - range.v > this.z - this.v ||
      range.z + range.v < this.z + this.v 
    );
  }
}

class Octree {
  constructor(boundary, n) {
    this.boundary = boundary; // Cube
    this.capacity = n; // capacidad maxima de cada cuadrante
    this.points = []; // vector , almacena los puntos a almacenar
    this.divided = false;
  }

  subdivide() {
    let x = this.boundary.x;
    let y = this.boundary.y;
    let z = this.boundary.z;
    let w = this.boundary.w;
    let h = this.boundary.h;
    let v = this.boundary.v;

    let qt_northeastFront = new Cube(x + w / 2, y + h / 2, z + v / 2, w / 2, h / 2, v / 2);
    this.northeastFront = new Octree(qt_northeastFront, this.capacity);
    let qt_northwestFront = new Cube(x + w / 2, y - h / 2, z + v / 2, w / 2, h / 2, v / 2);
    this.northwestFront = new Octree(qt_northwestFront, this.capacity);
    let qt_southeastFront = new Cube(x + w / 2, y + h / 2, z - v / 2, w / 2, h / 2, v / 2);
    this.southeastFront = new Octree(qt_southeastFront, this.capacity);
    let qt_southwestFront = new Cube(x + w / 2, y - h / 2, z - v / 2, w / 2, h / 2, v / 2);
    this.southwestFront = new Octree(qt_southwestFront, this.capacity);

    let qt_northeastBack = new Cube(x - w / 2, y + h / 2, z + v / 2, w / 2, h / 2, v / 2);
    this.northeastBack = new Octree(qt_northeastBack, this.capacity);
    let qt_northwestBack = new Cube(x - w / 2, y - h / 2, z + v / 2, w / 2, h / 2, v / 2);
    this.northwestBack = new Octree(qt_northwestBack, this.capacity);
    let qt_southeastBack = new Cube(x - w / 2, y + h / 2, z - v / 2, w / 2, h / 2, v / 2);
    this.southeastBack = new Octree(qt_southeastBack, this.capacity);
    let qt_southwestBack = new Cube(x - w / 2, y - h / 2, z - v / 2, w / 2, h / 2, v / 2);
    this.southwestBack = new Octree(qt_southwestBack, this.capacity);
  }

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
        this.divided = true;
      }
    }

    this.northeastFront.insert(point);
    this.northwestFront.insert(point);
    this.southeastFront.insert(point);
    this.southwestFront.insert(point);

    this.northeastBack.insert(point);
    this.northwestBack.insert(point);
    this.southeastBack.insert(point);
    this.southwestBack.insert(point);
  }

  show() {
    stroke(255);
    strokeWeight(1);
    noFill();
    box(this.boundary.w, this.boundary.h, this.boundary.v);

    if (this.divided) {
      this.northeastFront.show();
      this.northwestFront.show();
      this.southeastFront.show();
      this.southwestFront.show();

      this.northeastBack.show();
      this.northwestBack.show();
      this.southeastBack.show();
      this.southwestBack.show();
    }

    for (let p of this.points) {
      strokeWeight(5);
      point(p.x, p.y, p.z);
    }
  }

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
    }

    if (this.divided) {
      this.northeastFront.query(range, found);
      this.northwestFront.query(range, found);
      this.southeastFront.query(range, found);
      this.southwestFront.query(range, found);

      this.northeastBack.query(range, found);
      this.northwestBack.query(range, found);
      this.southeastBack.query(range, found);
      this.southwestBack.query(range, found);
    }
    return found;
  }
}
