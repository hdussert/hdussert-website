import { useEffect, useRef } from 'react';
import Canvas from './Canvas'

// Generating random strings
const characters : string = '\\<>?!#0123456789ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ'

const getRandomCharacter = () : string =>
characters.charAt((Math.random() * characters.length) | 0);

const getRandomInRange = (min: number, max: number): number => 
  (Math.random() * (max - min) + min) | 0;

const getRandomStream = (size: number) : string[] =>
  new Array(size)
  .fill(undefined)
  .map(_ => getRandomCharacter());

// Global Variables
const CANVAS_WIDTH = window.innerWidth
const CANVAS_HEIGHT = window.innerHeight

const NB_OF_STREAMS = 150;

const STREAM_LENGTH_MIN = 5
const STREAM_LENGTH_MAX = 30

const FONT_SIZE_MIN = 15
const FONT_SIZE_MAX = 30

const CHAR_UPDATE_FREQUENCY = .5

// const FIRST_CHAR_COLOR = '#FFFFFF' 
const FIRST_CHAR_COLOR = '#00EFEF' 
// const CHAR_COLOR = '#32FA64' 
const CHAR_COLOR = '#6432FA'

const MAX_SPEED = 5;

// Classes definitions
class Stream {
  ctx : CanvasRenderingContext2D
  
  stream!: string[]
  length!: number
  fontSize!: number
  size!: number
  
  x!: number
  y!: number
  
  baseOpacity!: number 
  speed!: number
  
  startFadingIndex!: number

  constructor(ctx : CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.reset()
  }

  reset (y = -1) {
    this.stream = getRandomStream(getRandomInRange(STREAM_LENGTH_MIN, STREAM_LENGTH_MAX))
    this.length = this.stream.length;
    this.fontSize = getRandomInRange(FONT_SIZE_MIN, FONT_SIZE_MAX)
    this.size = this.fontSize * this.length
    
    this.x = Math.random() * CANVAS_WIDTH | 0
    if (y !== -1) this.y = y;
    else this.y = Math.random() * (CANVAS_HEIGHT + this.size) | 0
    
    this.baseOpacity = this.fontSize / FONT_SIZE_MAX;
    this.speed = this.fontSize / FONT_SIZE_MAX * MAX_SPEED | 0
    
    this.startFadingIndex = this.length / 2 | 0
  }

  update() {
    this.y += this.speed;
    if (this.y > CANVAS_HEIGHT + this.size) return this.reset(0)
    
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

const MatrixRain = () => {
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let streams = useRef<Stream[]>([]);


  useEffect(()=>{
    if (!canvasRef.current) return

    const _ctx = canvasRef.current.getContext('2d')
    if (!_ctx) return;

    streams.current = new Array(NB_OF_STREAMS).fill(undefined).map(_ => new Stream(_ctx));
  }, [])
  

  const draw = (ctx: CanvasRenderingContext2D, frameCount: number) => {
    ctx.clearRect(0,0,CANVAS_WIDTH, CANVAS_HEIGHT);
    if (!streams) return 
    streams.current.forEach(s => s.animate());
  }

  return (
    <div className='fill matrix-rain-canvas'>
      <Canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} draw={draw}/>
    </div>
  )
}

export default MatrixRain