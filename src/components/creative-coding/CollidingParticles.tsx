import React, { useContext, useEffect, useRef } from 'react'
import { useMouseManager } from '../../hooks/useMouseManager'
import Canvas from './Canvas'
import { CollidingParticle } from './classes/CollidingParticle'
import { Circle, Point, Quadtree, Rectangle } from './classes/Quadtree'
import { CreativeProjectContext } from './CreativeProject'
import { distance, getRandomInRange, getRandomInRangeFloat } from './utils/Maths'

const NB_PARTICLES = 1000;
const Particles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctx = useRef<CanvasRenderingContext2D|null>()
  const particles = useRef<CollidingParticle[]>([])

  const context = useContext(CreativeProjectContext)
  const canvasWidth = context?.width || 0
  const canvasHeight = context?.height || 0
  const mousePressingTime = useRef(0);
  const mouse = useMouseManager(canvasRef)
  // Mouse Event
  useEffect(() => {
    if (!canvasRef.current) return
    ctx.current = canvasRef.current.getContext('2d')
  }, [])


  const addParticles = (color: string) => {
    if (ctx.current === null || ctx.current === undefined) return

    let { x, y } = mouse.position
    x += Math.random() * 20 - 10; y += Math.random() * 20 - 10

    particles.current.push(
      new CollidingParticle (
        ctx.current, 
        x, y,
        getRandomInRangeFloat(- Math.PI, Math.PI),
        getRandomInRange(2,8),
        getRandomInRange(10,30),
        color, 
        canvasWidth, canvasHeight
      )
    )

    if (particles.current.length > NB_PARTICLES) particles.current.shift()
  }

  const draw = (ctx: CanvasRenderingContext2D) => {
    // ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = 'rgba(0,0,0,.05)'
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    if (particles.current.length === 0) {
      ctx.fillStyle = '#FFFFFF'
      ctx.font = `60px Futura`
      ctx.fillText('CLICK ME', canvasWidth/2 - 150, canvasHeight/2)
    }
    
    if (mouse.button[0].pressed) {
      mousePressingTime.current += 1
      const hsl = `hsl(${mousePressingTime.current * 3}, 100%, 50%)`
      addParticles(hsl);
    }
    
    const quadBoundary = new Rectangle(canvasWidth / 2, canvasHeight / 2, canvasWidth / 2, canvasHeight / 2)
    const quadTree = new Quadtree(quadBoundary, 4)
    particles.current.forEach((p, i) => {
      p.update()
      const point = new Point(p.x, p.y, p);
      quadTree.insert(point);
      p.checked = false;
    })

    particles.current.forEach(p1 => {
      const circle = new Circle(p1.x, p1.y, 30 * 3)
      const others = quadTree.query(circle, null)

      others.forEach(op => {
        if (p1 === op.userData) return
        const p2 = op.userData
        if (p2.checked) return
        
        // Collisiong check
        let collisiondist = distance(p2.x, p2.y, p1.x, p1.y)
        const colliding = (collisiondist <= p1.size + p2.size)
        if (!colliding) return
        
        // If circles overlap we move them apart
        const overlaping = (collisiondist < p1.size + p2.size)
        if (overlaping) {
          // Accurate level : meh, should be improved
          const p1Force = p1.mass * (Math.abs(p1.vx) + Math.abs(p1.vy))
          const p2Force = p2.mass * (Math.abs(p2.vx) + Math.abs(p2.vy))
          
          // Get the factor so an object with the bigger force should move less than the other
          const p1Factor = 1 - (p1Force / (p1Force + p2Force))
          const p2Factor = 1 - p1Factor
          
          const distOverlap = (collisiondist - p1.size - p2.size);

          p1.x -= distOverlap * (p1.x - p2.x) / collisiondist * p1Factor;
          p1.y -= distOverlap * (p1.y - p2.y) / collisiondist * p1Factor;
          p2.x += distOverlap * (p1.x - p2.x) / collisiondist * p2Factor; 
          p2.y += distOverlap * (p1.y - p2.y) / collisiondist * p2Factor;
        }

        collisiondist = distance(p2.x, p2.y, p1.x, p1.y)
        
        // Normalized
        const n_x = (p2.x - p1.x) / collisiondist; 
        const n_y = (p2.y - p1.y) / collisiondist; 

        const kx = (p1.vx - p2.vx)
        const ky = (p1.vy - p2.vy)

        // Impulse
        const dot = 2 * (n_x * kx + n_y * ky) / (p1.mass + p2.mass); 

        p1.vx = p1.vx - dot * p2.mass * n_x; 
        p1.vy = p1.vy - dot * p2.mass * n_y; 
        p2.vx = p2.vx + dot * p1.mass * n_x; 
        p2.vy = p2.vy + dot * p1.mass * n_y;
      })
      p1.checked = true;
      p1.draw()
    })
  }
  
  return (
    <div className='particles'>
      <Canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} draw={draw} fpsCap={60}/>
    </div>
  )
}

export default Particles