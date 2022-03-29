import { getRandomInRange } from "../utils/Maths";

const SPEED_MIN = 1
const SPEED_MAX = 10
const SIZE_MIN = 10;
const SIZE_MAX = 20;
const CIRCLE_PARTICLE_SIZE_MAX = SIZE_MAX;

class CircleParticle {
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

export { CircleParticle, CIRCLE_PARTICLE_SIZE_MAX }