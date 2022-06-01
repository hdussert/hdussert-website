import React, { useContext, useEffect, useRef } from 'react'
import Canvas from './Canvas';
import { ParticleWithOrigin } from './classes/ParticleWithOrigin';
import { Circle, Point, Quadtree, Rectangle } from './classes/Quadtree';
import { CreativeProjectContext } from './CreativeProject';
import { Vector2d } from './utils/Interfaces';
import { distanceSqr } from './utils/Maths';

const MAX_PARTICLES = 250
const Dalma = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctx = useRef<CanvasRenderingContext2D|null>()
  const context = useContext(CreativeProjectContext)
  const canvasWidth = context?.width || 0
  const canvasHeight = context?.height || 0

  const points = useRef<ParticleWithOrigin[]>([])
  
  const text = 'Dalma'


  useEffect(() => {
    if (!canvasRef.current) return
    ctx.current = canvasRef.current.getContext('2d')
    const _canvasRef = canvasRef.current; // need an immutable instance for cleanup func
    if (!ctx.current) return
    points.current = [];
    setTimeout(()=> {
      points.current.forEach(p => p.backToOrigin = true)
    }, 5000)
  }, [])

  let test = false;
  const draw = (ctx: CanvasRenderingContext2D) => {
    if (!test) {
      ctx.clearRect(0,0,canvasWidth, canvasHeight);
      ctx.font = `200px Futura`
      ctx.fillStyle = '#FFF'
      ctx.fillText(text, canvasWidth/2 - 280, canvasHeight/2);
      var pixels = ctx.getImageData(0,0,canvasWidth, canvasHeight).data;
      for (let x = 0; x < canvasWidth; x+= 5) {
        for (let y = 0; y < canvasHeight; y+= 5) {
          const alpha = pixels[(y * canvasWidth + x) * 4 + 3]; 
          if (alpha > 0) {
            points.current?.push(new ParticleWithOrigin (ctx, 
              1 + Math.random() * canvasWidth, 1 + Math.random() * canvasHeight, 
              x, y, 
              canvasWidth, canvasHeight, 
              '#FFF', 2, 4, 1, 5))
            }
        }
      }
      test = true;
      ctx.clearRect(0,0,canvasWidth, canvasHeight);
    }
    ctx.fillStyle = 'rgb(78, 104, 246)'
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
    const quadBoundary = new Rectangle(canvasWidth / 2, canvasHeight / 2, canvasWidth / 2, canvasHeight / 2)
    const quadTree = new Quadtree(quadBoundary, 4)

    points.current?.forEach(p => {
      p.animate();
      p.checked = false;
      const point = new Point(p.x, p.y, p)
      quadTree.insert(point);
    })

    // points.current?.forEach(p => {
    //   const circle = new Circle(p.x, p.y, 4)
    //   const pointsInRange = quadTree.query(circle, null)
    //   pointsInRange.forEach(point => {
    //     const p2 = point.userData
    //     if (p2.checked) return
    //     ctx.beginPath() 
    //     ctx.lineWidth = (1 - distanceSqr(p.x, p.y, p2.x, p2.y) / 5625)
    //     ctx.strokeStyle = p.color
    //     ctx.moveTo(p.x, p.y)
    //     ctx.lineTo(p2.x, p2.y)
    //     ctx.stroke()
    //     ctx.closePath()
    //   })
    //   // p.draw()
    //   p.checked = true
    // })
  }

  return (
    <div>
      <Canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} draw={draw} fpsCap={60}/>
    </div>
  )
}

export default Dalma