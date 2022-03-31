import React, { useContext, useEffect, useRef } from 'react'
import Canvas from './Canvas';
import { Circle, Point, Quadtree, Rectangle } from './classes/Quadtree';
import { CreativeProjectContext } from './CreativeProject';
import { Vector2d } from './utils/Interfaces';

let perlinGrid: Vector2d[][] = [];
let numberOfNodes = 8; // nb of points to interpolate with

function random_unit_vector() : Vector2d {
  let theta = Math.random() * 2 * Math.PI;
  return {
      x: Math.cos(theta),
      y: Math.sin(theta)
  };
}

for (let i = 0; i < numberOfNodes; i++) {
  console.log('executed')
  let row = [];
  for (let j = 0; j < numberOfNodes; j++) {
      row.push(random_unit_vector());
  }
  perlinGrid.push(row);
}

function dot_prod_grid(x: number, y: number, vert_x: number, vert_y: number){
  const g_vect = perlinGrid[vert_y][vert_x];
  const d_vect = {x: x - vert_x, y: y - vert_y};
  return d_vect.x * g_vect.x + d_vect.y * g_vect.y;
}

function lin_interp(x: number, a: number, b: number){
  return a + x * (b-a);
}

function perlin_noise(x : number, y : number) {
  const x0 = Math.floor(x);
  const x1 = x0 + 1;
  const y0 = Math.floor(y);
  const y1 = y0 + 1;

  const sx = x - x0
  const sy = y - y0

  let n0 = dot_prod_grid(x, y, x0, y0)
  let n1 = dot_prod_grid(x, y, x1, y0)
  const ix0 = lin_interp(n0, n1, sx)

  n0 = dot_prod_grid(x, y, x0, y1)
  n1 = dot_prod_grid(x, y, x1, y1)
  const ix1 = lin_interp(n0, n1, sx)

  const intensity = lin_interp(ix0, ix1, sy)
  return intensity;
}


const QuadTreeDemo = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctx = useRef<CanvasRenderingContext2D|null>()
  
  const context = useContext(CreativeProjectContext)
  const canvasWidth = context?.width || 0
  const canvasHeight = context?.height || 0

  const points = useRef<Point[]>()
  
  const mousePosition = useRef<Vector2d>({x: 100, y: 100});
  useEffect(() => {
    if (!canvasRef.current) return
    ctx.current = canvasRef.current.getContext('2d')

    const _canvasRef = canvasRef.current;
    const setMousePosition = (event: MouseEvent) => {
      mousePosition.current = {x: event.offsetX, y: event.offsetY}
    }
    _canvasRef.addEventListener('mousemove', setMousePosition)

    points.current = new Array(1000).fill(undefined).map(_ => {
      let intensity = 0;
      let x = 0;
      let y = 0;
      while (intensity < .7) {
        x = Math.random() * canvasWidth
        y = Math.random() * canvasHeight
        intensity = Math.abs(perlin_noise(x / canvasWidth * (numberOfNodes - 1), y / canvasHeight * (numberOfNodes - 1)));
      }
      return new Point (x, y, undefined)
    })

    return () => {
      _canvasRef.removeEventListener('mousemove', setMousePosition)
    }
  }, [])

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    const quadBoundary = new Rectangle(canvasWidth / 2, canvasHeight / 2, canvasWidth / 2, canvasHeight / 2)
    const quadTree = new Quadtree(quadBoundary, 4)

    ctx.fillStyle = '#F00';
    points.current?.forEach(p => {
      ctx.beginPath();
      ctx.rect(p.x, p.y, 2, 2);
      ctx.fill();
      quadTree.insert(p);
    })
    quadTree.show(ctx)

    ctx.beginPath()
    ctx.ellipse(mousePosition.current.x ,mousePosition.current.y, 50, 50, 0, 0, 360)
    ctx.strokeStyle = '#00FF00'
    ctx.stroke()
    ctx.closePath()

    const circle = new Circle(mousePosition.current.x, mousePosition.current.y, 50)
    const pointsInCircleRange = quadTree.query(circle, null)
    pointsInCircleRange.forEach(p => {
      ctx.beginPath()
      ctx.rect(p.x, p.y, 2, 2)
      ctx.strokeStyle = '#00FF00'
      ctx.stroke()
    })
  }

  return (
    <div>
      <Canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} draw={draw} fpsCap={60}/>
    </div>
  )
}

export default QuadTreeDemo

    // DEBUG 
    /*

    */