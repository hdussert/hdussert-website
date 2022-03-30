import React, { useContext, useEffect, useRef } from 'react'
import { CreativeCodingContext } from '../../pages/CreativeCoding'
import Canvas from './Canvas'
import { CircleParticle, CIRCLE_PARTICLE_SIZE_MAX } from './classes/CircleParticle'
import { Circle, Point, Quadtree, Rectangle } from './classes/Quadtree'
import { distance } from './utils/Maths'

interface vector2d {
  x: number,
  y: number
}

const NB_PARTICLES = 1000;
const Particles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctx = useRef<CanvasRenderingContext2D|null>()
  const particles = useRef<CircleParticle[]>([])

  const context = useContext(CreativeCodingContext)
  const canvasWidth = context?.width || 0
  const canvasHeight = context?.height || 0
  const mouseDown = useRef(false);
  const mousePosition = useRef<vector2d>({x: 100, y: 100});
  const mousePressingTime = useRef(0);

  useEffect(()=> {
    if (!canvasRef.current) return
    
    ctx.current = canvasRef.current.getContext('2d')
    if (ctx.current === null || ctx.current === undefined) return;

  }, [canvasWidth, canvasHeight])

  // Mouse Event
  useEffect(() => {
    if (!canvasRef.current) return
    const _canvasRef = canvasRef.current; // need an immutable instance for cleanup func

    const mouseIsDown = (event: MouseEvent) => {
      if (event.button === 0) mouseDown.current = true
    }

    const mouseIsUp  = (event: MouseEvent) => {
      if (event.button === 0) mouseDown.current = false
    }

    const setMousePosition = (event: MouseEvent) => {
      mousePosition.current = {x: event.offsetX, y: event.offsetY}
    }

    _canvasRef.addEventListener('mousemove', setMousePosition)
    _canvasRef.addEventListener('mousedown', mouseIsDown)
    _canvasRef.addEventListener('mouseup', mouseIsUp)

    return () => {
      _canvasRef.removeEventListener('mousemove', setMousePosition)
      _canvasRef.removeEventListener('mousedown', mouseIsDown)
      _canvasRef.removeEventListener('mouseup', mouseIsUp)
    }
  }, [])


  const addParticles = (color: string) => {
    if (ctx.current === null || ctx.current === undefined) return

    let {x, y} = mousePosition.current
    x += Math.random() * 20 - 10; y += Math.random() * 20 - 10

    particles.current.push(new CircleParticle (ctx.current, x, y, canvasWidth, canvasHeight, color))
    if (particles.current.length > NB_PARTICLES) particles.current.shift()
  }

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    if (mouseDown.current) {
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
      p.collision = false;
    })

    particles.current.forEach(p1 => {
      const circle = new Circle(p1.x, p1.y, CIRCLE_PARTICLE_SIZE_MAX * 3)
      const others = quadTree.query(circle, null)

      others.forEach(op => {
        if (p1 === op.userData) return
        const p2 = op.userData
        if (p2.collision) return
        
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
      p1.collision = true;
      p1.draw()
    })
    // quadTree.show(ctx)

    /* DRAW LINES BETWEEN THEM */
    // particles.current.forEach(p => {
    //   const circle = new Circle(p.x, p.y, 50)
    //   const others = quadTree.query(circle, null)
    //   others.forEach(op => {
    //     if (p === op.userData) return
    //     ctx.beginPath() 
    //     ctx.strokeStyle = p.color
    //     ctx.moveTo(p.x, p.y)
    //     ctx.lineTo(op.x, op.y)
    //     ctx.stroke()
    //     ctx.closePath()
    //     // 
    //   })
    // })
  }
    // DEBUG 
    /*
    ctx.beginPath()
    ctx.ellipse(mousePosition.current.x ,mousePosition.current.y, 50, 50, 0, 0, 360)
    ctx.strokeStyle = '#00FF00'
    ctx.stroke()
    ctx.closePath()
    const circle = new Circle(mousePosition.current.x, mousePosition.current.y, 50)
    const others = quadTree.query(circle, null)
    others.forEach(op => {
      ctx.beginPath()
      ctx.ellipse(op.x, op.y, 2, 2, 0, 0, 360)
      ctx.strokeStyle = '#00FF00'
      ctx.stroke()
      ctx.closePath()
    })
    */
  
  return (
    <div className='particles'>
      <Canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} draw={draw} fpsCap={60}/>
    </div>
  )
}

export default Particles