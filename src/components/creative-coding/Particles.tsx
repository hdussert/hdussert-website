import React, { useContext, useEffect, useRef } from 'react'
import { CreativeCodingContext } from '../../pages/CreativeCoding'
import { getRandomInRange } from '../../utils/canvas'
import Canvas from './Canvas'
import { Circle, Point, Quadtree, Rectangle } from './Quadtree'

const SPEED_MIN = 1
const SPEED_MAX = 10
const SIZE_MIN = 10;
const SIZE_MAX = 20;

class Particle {
  ctx: CanvasRenderingContext2D
  canvasWidth: number
  canvasHeight: number
  
  x: number
  y: number
  vx: number
  vy: number

  size: number
  mass: number

  color: string
  collision: boolean

  constructor(ctx: CanvasRenderingContext2D, x: number, y: number, canvasWidth: number, canvasHeight: number, color: string) {
    this.ctx = ctx
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight

    this.x = x
    this.y = y

    let dir = Math.random() * Math.PI * 2 - Math.PI / 2;
    let speed = getRandomInRange(SPEED_MAX, SPEED_MIN);
    this.vx = Math.sin(dir) * speed;
    this.vy = Math.cos(dir) * speed;

    this.size = getRandomInRange(SIZE_MIN, SIZE_MAX)
    this.mass = this.size * this.size;
    this.color = color

    this.collision = false
  }

  update() {
    if (this.x < 0 || this.x > this.canvasWidth) {
      this.x = this.x < 0 ? 0 : this.canvasWidth
      this.vx *= -1
    }
    if (this.y < 0 || this.y > this.canvasHeight) {
      this.y = this.y < 0 ? 0 : this.canvasHeight
      this.vy *= -1
    }
    
    this.x += this.vx
    this.y += this.vy
  }

  draw() {
    this.ctx.beginPath()
    this.ctx.ellipse(this.x, this.y, this.size, this.size, 0, 0, 360)
    this.ctx.fillStyle = this.color
    this.ctx.fill()

  }

  animate() {
    this.update()
    this.draw()
  }
}

interface vector2d {
  x: number,
  y: number
}

const NB_PARTICLES = 1000;
const Particles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctx = useRef<CanvasRenderingContext2D|null>()
  const particles = useRef<Particle[]>([])

  const context = useContext(CreativeCodingContext)
  const canvasWidth = context?.width || 0
  const canvasHeight = context?.height || 0
  const mouseDown = useRef(false);
  const mousePosition = useRef<vector2d>({x: 100, y: 100});
  const mousePressingTime = useRef(0);

  useEffect(()=> {
    if (!canvasRef.current) return
    const _canvasRef = canvasRef.current; // need an immutable instance for cleanup func
    
    ctx.current = _canvasRef.getContext('2d')
    if (ctx.current === null || ctx.current === undefined) return;
    
    canvasRef.current.addEventListener('mousemove', setMousePosition)
    window.addEventListener('mousedown', mouseIsDown)
    window.addEventListener('mouseup', mouseIsUp)

    return () => {
      _canvasRef.removeEventListener('mousemove', setMousePosition)
      window.removeEventListener('mousedown', mouseIsDown)
      window.removeEventListener('mouseup', mouseIsUp)
    }

  }, [canvasWidth, canvasHeight])

  // Mouse event handlers
  const mouseIsDown = (event: MouseEvent) => {
    if (event.button === 0) mouseDown.current = true
    addParticles("")
  }

  const mouseIsUp  = (event: MouseEvent) => {
    if (event.button === 0) mouseDown.current = false
  }

  const setMousePosition = (event: MouseEvent) => {
    mousePosition.current = {x: event.offsetX, y: event.offsetY}
  }


  const addParticles = (color: string) => {
    if (ctx.current === null || ctx.current === undefined) return

    let {x, y} = mousePosition.current
    x += Math.random() * 20 - 10
    y += Math.random() * 20 - 10 
    particles.current.push(new Particle (ctx.current, x, y, canvasWidth, canvasHeight, color))
    if (particles.current.length > NB_PARTICLES) particles.current.shift()
  }

  const distance = (x1: number, y1: number, x2: number, y2: number) => {
    const dx  = x1 - x2
    const dy  = y1 - y2
    return Math.sqrt(dx * dx + dy * dy)
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
      // p.animate()
      p.update()
      const point = new Point(p.x, p.y, p);
      quadTree.insert(point);
      p.collision = false;
      // p.draw()
    })

    particles.current.forEach(p1 => {
      const circle = new Circle(p1.x, p1.y, SIZE_MAX * 3)
      const others = quadTree.query(circle, null)

      others.forEach(op => {
        if (p1 === op.userData) return
        const p2 = op.userData
        if (p2.collision) return
        
        let collisiondist = distance(p2.x, p2.y, p1.x, p1.y)
        const overlaping = (collisiondist < p1.size + p2.size)
        const colliding = (collisiondist <= p1.size + p2.size)
        if (!colliding) return


        
        if (overlaping) {
          const distOverlap = (collisiondist - p1.size - p2.size);
          
          const p1Force = p1.mass * (Math.abs(p1.vx) + Math.abs(p1.vy))
          const p2Force = p2.mass * (Math.abs(p2.vx) + Math.abs(p2.vy))
          const p1Factor = 1 - (p1Force / (p1Force + p2Force))
          const p2Factor = 1 - p1Factor

          p1.x -= distOverlap * (p1.x - p2.x) / collisiondist * p1Factor;
          p1.y -= distOverlap * (p1.y - p2.y) / collisiondist * p1Factor;
          p2.x += distOverlap * (p1.x - p2.x) / collisiondist * p2Factor; 
          p2.y += distOverlap * (p1.y - p2.y) / collisiondist * p2Factor;
        }

        collisiondist = distance(p2.x, p2.y, p1.x, p1.y)

        const n_x = (p2.x - p1.x) / collisiondist; 
        const n_y = (p2.y - p1.y) / collisiondist; 

        const kx = (p1.vx - p2.vx)
        const ky = (p1.vy - p2.vy)
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



        // Get the position of both for when they collide
        // const backDistance = Math.sqrt(Math.pow(p1.size + p2.size, 2) - dist)

        // const velocityLen = Math.sqrt(Math.pow(p1.vx, 2) + Math.pow(p1.vy, 2));
        // const p_x = point.x - backDistance * (p1.vx / velocityLen)
        // const p_y = point.y - backDistance * (p1.vy / velocityLen)

        // const otherVelocityLen = Math.sqrt(Math.pow(p2.vx, 2) + Math.pow(p2.vy, 2));
        // const other_x = otherPoint.x - backDistance * (p2.vx / otherVelocityLen)
        // const other_y = otherPoint.y - backDistance * (p2.vy / otherVelocityLen)