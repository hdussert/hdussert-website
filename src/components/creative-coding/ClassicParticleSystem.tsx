import React, { useContext, useEffect, useRef } from 'react'
import { useMouseManager } from '../../hooks/useMouseManager';
import Canvas from './Canvas';
import { CagedParticle } from './classes/Particle';
import { Circle, Point, Quadtree, Rectangle } from './classes/Quadtree';
import { CreativeProjectContext } from './CreativeProject';
import { distanceSqr, getRandomInRange, getRandomInRangeFloat } from './utils/Maths';

const MAX_PARTICLES = 250
const ClassicParticleSystem = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctx = useRef<CanvasRenderingContext2D|null>()
  const mousePressingTime = useRef(0);
  const mouse = useMouseManager(canvasRef)
  const context = useContext(CreativeProjectContext)
  const canvasWidth = context?.width || 0
  const canvasHeight = context?.height || 0

  const points = useRef<CagedParticle[]>([])
  
  useEffect(() => {
    if (!canvasRef.current) return
    ctx.current = canvasRef.current.getContext('2d')
  }, [])

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    if (mouse.button[0].pressed) {
      mousePressingTime.current += 1
      const hsl = `hsl(${mousePressingTime.current * 3}, 100%, 50%)`
      points.current?.push(new CagedParticle (ctx, 
        mouse.position.x, mouse.position.y,
        getRandomInRangeFloat(- Math.PI, Math.PI),
        getRandomInRange(1,5),
        getRandomInRange(3,5),
        hsl, 
        canvasWidth, canvasHeight))
      if (points.current.length > MAX_PARTICLES) points.current.shift()
    }

    if (points.current.length === 0) {
      ctx.fillStyle = '#FFFFFF'
      ctx.font = `60px Futura`
      ctx.fillText('CLICK ME', canvasWidth/2 - 150, canvasHeight/2)
    }

    const quadBoundary = new Rectangle(canvasWidth / 2, canvasHeight / 2, canvasWidth / 2, canvasHeight / 2)
    const quadTree = new Quadtree(quadBoundary, 4)

    points.current?.forEach(p => {
      p.update();
      p.checked = false;
      const point = new Point(p.x, p.y, p)
      quadTree.insert(point);
    })

    points.current?.forEach(p => {
      const circle = new Circle(p.x, p.y, 75)
      const pointsInRange = quadTree.query(circle, null)
      pointsInRange.forEach(point => {
        const p2 = point.userData
        if (p2.checked) return
        ctx.beginPath() 
        ctx.lineWidth = (1 - distanceSqr(p.x, p.y, p2.x, p2.y) / 5625) * 5
        ctx.strokeStyle = p.color
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(p2.x, p2.y)
        ctx.stroke()
        ctx.closePath()
      })
      p.draw()
      p.checked = true
    })
  }

  return (
    <div>
      <Canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} draw={draw} fpsCap={60}/>
    </div>
  )
}

export default ClassicParticleSystem