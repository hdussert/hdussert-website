import { getRandomInRange } from "../utils/Maths";

// Generating random strings
const characters = '\\<>?!#0123456789ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ'

function getRandomCharacter() : string {
  return characters.charAt((Math.random() * characters.length) | 0);
}

function getRandomStream(size: number) : string[] {
  return new Array(size).fill(undefined).map(_ => getRandomCharacter());
}

// Globals
const STREAM_LENGTH_MIN = 5
const STREAM_LENGTH_MAX = 30

const FONT_SIZE_MIN = 15
const FONT_SIZE_MAX = 30

const CHAR_UPDATE_FREQUENCY = .5

const FIRST_CHAR_COLOR = '#00EFEF' 
const CHAR_COLOR = '#6432FA'

const MAX_SPEED = 5;

// Class
class Stream {
  ctx : CanvasRenderingContext2D
  canvasWidth: number
  canvasHeight: number
  stream!: string[]
  length!: number
  fontSize!: number
  size!: number
  
  x!: number
  y!: number
  
  baseOpacity!: number 
  speed!: number
  
  startFadingIndex!: number

  constructor(ctx : CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight
    this.ctx = ctx;
    this.init()
  }

  init (y = -1) {
    this.stream = getRandomStream(getRandomInRange(STREAM_LENGTH_MIN, STREAM_LENGTH_MAX))
    this.length = this.stream.length;
    this.fontSize = getRandomInRange(FONT_SIZE_MIN, FONT_SIZE_MAX)
    this.size = this.fontSize * this.length
    
    this.x = Math.random() * this.canvasWidth | 0
    if (y !== -1) this.y = y;
    else this.y = Math.random() * (this.canvasHeight + this.size) | 0
    
    this.baseOpacity = this.fontSize / FONT_SIZE_MAX;
    this.speed = this.fontSize / FONT_SIZE_MAX * MAX_SPEED | 0
    
    this.startFadingIndex = this.length / 2 | 0
  }

  update() {
    this.y += this.speed;
    if (this.y > this.canvasHeight + this.size) return this.init(0)
    
    if (Math.random() < CHAR_UPDATE_FREQUENCY) 
      this.stream[getRandomInRange(0, this.length)] = getRandomCharacter()
  }

  draw() {
    this.ctx.fillStyle = FIRST_CHAR_COLOR
    this.ctx.font = `${this.fontSize}px Arial`
    
    this.stream.forEach((s, i)=> {

      let opacity = 0;
      if (i > this.startFadingIndex) 
        opacity = (i - this.startFadingIndex) / this.startFadingIndex; 
      
      opacity = Math.max(((this.baseOpacity - opacity) * 255) | 0, 0)
      
      if (i === 0) this.ctx.fillStyle = `${FIRST_CHAR_COLOR}${opacity.toString(16)}`
      else this.ctx.fillStyle = `${CHAR_COLOR}${opacity.toString(16)}`
      
      this.ctx.fillText(s, this.x, this.y - i * this.fontSize)
    })
  }

  animate() {
    this.update()
    this.draw()
  }
}

export { Stream }