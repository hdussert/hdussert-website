import React, { useContext, useEffect, useRef } from 'react'
import { FunContext } from '../../pages/Fun'
import { getRandomInRange } from '../../utils/canvas'
import Canvas from './Canvas'
import { Circle, Point, Quadtree, Rectangle } from './Quadtree'

const SPEED_MIN = 1
const SPEED_MAX = 3
const SIZE_MIN = 10;
const SIZE_MAX = 20;

class Particle {
  ctx: CanvasRenderingContext2D
  canvasWidth: number
  canvasHeight: number
  
  x: number
  y: number
  speedX: number
  speedY: number

  size: number
  color: string

  constructor(ctx: CanvasRenderingContext2D, x: number, y: number, canvasWidth: number, canvasHeight: number, color: string) {
    this.ctx = ctx
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight

    this.x = x
    this.y = y

    let dir = Math.random() * Math.PI * 2 - Math.PI / 2;
    let speed = getRandomInRange(SPEED_MAX, SPEED_MIN);
    this.speedX = Math.sin(dir) * speed;
    this.speedY = Math.cos(dir) * speed;

    this.size = getRandomInRange(SIZE_MIN, SIZE_MAX)
    this.color = color
  }

  update() {
    if (this.x < 0 || this.x > this.canvasWidth) this.speedX *= -1
    if (this.y < 0 || this.y > this.canvasHeight) this.speedY *= -1
    if (this.size > 1) this.size -= .1;
    
    this.x += this.speedX
    this.y += this.speedY
  }

  draw() {
    this.ctx.beginPath()
    this.ctx.ellipse(this.x, this.y, this.size, this.size, 0, 0, 360)
    this.ctx.fillStyle = this.color
    this.ctx.fill()
    // this.ctx.strokeStyle = this.color
    // this.ctx.stroke()
    this.ctx.closePath()
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

const NB_PARTICLES = 500;
const Particles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctx = useRef<CanvasRenderingContext2D|null>()
  const particles = useRef<Particle[]>([])

  const context = useContext(FunContext)
  const canvasWidth = context?.width || 0
  const canvasHeight = context?.height || 0
  const mouseDown = useRef(false);
  const mousePosition = useRef<vector2d>({x: 0, y: 0});
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
  }

  const mouseIsUp  = (event: MouseEvent) => {
    if (event.button === 0) mouseDown.current = false
  }

  const setMousePosition = (event: MouseEvent) => {
    mousePosition.current = {x: event.offsetX, y: event.offsetY}
  }


  const addParticles = (color: string) => {
    if (ctx.current === null || ctx.current === undefined) return

    const {x, y} = mousePosition.current
    particles.current.push(new Particle (ctx.current, x, y, canvasWidth, canvasHeight, color))
    if (particles.current.length > NB_PARTICLES) particles.current.shift()
  }

  
  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    if (mouseDown.current) {
      mousePressingTime.current += 1
      const hsl = `hsl(${mousePressingTime.current * 3}, 100%, 50%)`
      addParticles(hsl);
    }
    
    const quadBoundary = new Rectangle(canvasWidth / 2, canvasHeight / 2, canvasWidth / 2, canvasHeight / 2)
    const quadTree = new Quadtree(quadBoundary, 4)
    particles.current.forEach((p, i) => {
      const point = new Point(p.x, p.y, p);
      quadTree.insert(point);
      p.animate()
    })

    particles.current.forEach(p => {
      const circle = new Circle(p.x, p.y, 100)
      const others = quadTree.query(circle, null)
      others.forEach(op => {
        if (p === op.userData) return
        ctx.beginPath() 
        // const gradient = ctx.createLinearGradient(p.x, p.y, op.x, op.y)
        // gradient.addColorStop(0, p.color)
        // gradient.addColorStop(1, op.userData.color)
        // ctx.strokeStyle = gradient
        ctx.strokeStyle = p.color
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(op.x, op.y)
        ctx.stroke()
        ctx.closePath()
      })
    })
    quadTree.show(ctx)
  }

  return (
    <div className='particles'>
      <Canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} draw={draw} fpsCap={60}/>
    </div>
  )
}

export default Particles