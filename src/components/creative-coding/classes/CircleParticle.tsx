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
  checked: boolean

  constructor(ctx: CanvasRenderingContext2D, x: number, y: number, canvasWidth: number, canvasHeight: number, color: string, sizeMin = SIZE_MIN, sizeMax = SIZE_MAX, velMin = SPEED_MIN, velMax = SPEED_MAX) {
    this.ctx = ctx
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight

    this.x = x
    this.y = y

    let dir = Math.random() * Math.PI * 2 - Math.PI / 2;
    let speed = getRandomInRange(velMin, velMax);
    this.vx = Math.sin(dir) * speed;
    this.vy = Math.cos(dir) * speed;

    this.size = getRandomInRange(sizeMin, sizeMax)
    this.mass = this.size * this.size;
    this.color = color

    this.checked = false
  }

  update() {
    if (this.x <= this.size || this.x >= this.canvasWidth - this.size) {
      this.x = this.x <= this.size ? this.size : this.canvasWidth - this.size
      this.vx *= -1
    }

    if (this.y <= this.size || this.y >= this.canvasHeight - this.size) {
      this.y = this.y <= this.size ? this.size : this.canvasHeight - this.size
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