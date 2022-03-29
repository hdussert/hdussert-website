class Point {
  x: number; y: number
  userData: any

  constructor(x: number, y: number, userData: any) {
    this.x = x
    this.y = y
    this.userData = userData
  }
}

class Rectangle {
  x: number; y: number
  w: number; h: number
  constructor(x: number, y: number, w: number, h: number) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
  }

  contains(p: Point) : boolean {
    if (this.x - this.w <= p.x && this.x + this.w >= p.x
    && this.y - this.h <= p.y && this.y + this.h >= p.y) return true;

    return false
  }

  intersects(range: Rectangle) {
    const { x, y, w, h} = range
    return !(x - w > this.x + this.w || x + w < this.x - this.w || y - h > this.y + this.h || y + h < this.y - this.h)    
  }

  containsRectangle(rec: Rectangle) {
    const { x, y, w, h} = rec
    return (x + w > this.x + this.w && x - w < this.x - this.w 
          && y + h > this.y + this.h && y - h < this.y - this.h)    
  }
}

class Circle {
  x: number; y: number
  r: number; rSquared: number

  constructor(x: number, y: number, r: number) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.rSquared = this.r * this.r;
  }

  contains(p: Point) {
    const d = Math.pow((p.x - this.x), 2) + Math.pow((p.y - this.y), 2);
    return d <= this.rSquared;
  }

  intersects(range: Rectangle) {

    const xDist = Math.abs(this.x - range.x);
    const yDist = Math.abs(this.y - range.y);

    // radius of the circle
    const r = this.r;

    const w = range.w;
    const h = range.h;

    const edges = Math.pow((xDist - w), 2) + Math.pow((yDist - h), 2);

    // no intersection
    if (xDist > (r + w) || yDist > (r + h)) return false;

    // intersection within the circle
    if (xDist <= w || yDist <= h) return true;

    // intersection on the edge of the circle
    return edges <= this.rSquared;
  }
}

interface subQuad {
  NW: Quadtree
  NE: Quadtree
  SW: Quadtree
  SE: Quadtree
}

class Quadtree {
  boundary: Rectangle
  capacity: number
  points: Point[]
  divided: boolean
  sub: subQuad | null

  constructor(boundary: Rectangle, capacity: number) {
    this.boundary = boundary
    this.capacity = capacity
    this.points = []
    this.divided = false
    this.sub = null
  }

  subdivide() {
    const { x, y, w, h } = this.boundary
    const _w = w / 2
    const _h = h / 2
    this.sub = {
      NW: new Quadtree(new Rectangle(x - _w, y - _h, _w, _h), this.capacity),
      NE: new Quadtree(new Rectangle(x + _w, y - _h, _w, _h), this.capacity),
      SW: new Quadtree(new Rectangle(x - _w, y + _h, _w, _h), this.capacity),
      SE: new Quadtree(new Rectangle(x + _w, y + _h, _w, _h), this.capacity)
    }

    this.points.forEach(p => {
      if (this.sub?.NW.insert(p)
        ||this.sub?.NE.insert(p)
        ||this.sub?.SW.insert(p)
        ||this.sub?.SE.insert(p)) return
    })

    this.points = []
    this.divided = true;
  }
  
  query(range: Rectangle | Circle, found: Point[] | null) {
    if (!found) found = []
    if (!range.intersects(this.boundary)) {
      return found
    }
    for (let p of this.points) {
      if (range.contains(p) && found !== null) {
        found.push(p)
      }
    }

    if (this.divided && this.sub) {
      this.sub.NW.query(range, found)
      this.sub.NE.query(range, found)
      this.sub.SW.query(range, found)
      this.sub.SE.query(range, found)
    }

    // if (range.containsRectangle(this.boundary)) return found.concat(this.points) 
    // console.log(found)
    return found
  }

  insert(p: Point) {
    if (!this.boundary.contains(p)) return false

    if (!this.divided && this.points.length < this.capacity) {
      this.points.push(p);
      return true
    }
    
    if (!this.divided) {
      this.subdivide()
    }

    if (this.sub?.NW.insert(p)
      ||this.sub?.NE.insert(p)
      ||this.sub?.SW.insert(p)
      ||this.sub?.SE.insert(p)) return true
  }

  show(ctx: CanvasRenderingContext2D) {
    const { x, y, w, h } = this.boundary
    
    ctx.beginPath()
    ctx.rect(x - w, y - h, w * 2, h * 2);
    ctx.strokeStyle = '#FFFFFF'
    ctx.stroke()
    ctx.closePath()

    if (!this.divided) return

    this.sub?.NW.show(ctx)
    this.sub?.NE.show(ctx)
    this.sub?.SW.show(ctx)
    this.sub?.SE.show(ctx)
  }
}

export { Point, Rectangle, Circle, Quadtree }