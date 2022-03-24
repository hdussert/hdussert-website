import Canvas from './Canvas'

// Global Variables

const canvasWidth = 768
const canvasHeight = window.innerHeight

const characters : string = '\\<>?!#0123456789ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ'

const minStreamSize = 5
const maxStreamSize = 30

const minFontSize = 15
const maxFontSize = 30

const charUpdateFrequency = .5

const firstCharColor = '#00EFEF'
// const charColor = '#32FA64'
const charColor = '#6432FA'

const maxSpeed = 5;

// Generating random strings

const getRandomCharacter = () : string =>
characters.charAt((Math.random() * characters.length) | 0);

const getRandomInRange = (min: number, max: number): number => 
  (Math.random() * (max - min) + min) | 0;

const getRandomStream = (size: number) : string[] =>
  new Array(size)
  .fill(undefined)
  .map(_ => getRandomCharacter());

// ---

class Stream {
  x!: number
  y!: number
  
  fontSize!: number
  baseOpacity!: number 
  speed!: number
  
  stream!: string[]
  size!: number
  
  constructor() {
    this.reset()
  }

  reset (y = Math.random() * canvasHeight | 0) {
    this.x = Math.random() * canvasWidth | 0
    this.y = y
    
    this.fontSize = getRandomInRange(minFontSize, maxFontSize)
    this.baseOpacity = this.fontSize / maxFontSize;
    this.speed = this.fontSize / maxFontSize * maxSpeed | 0
    
    this.stream = getRandomStream(getRandomInRange(minStreamSize, maxStreamSize))  
    this.size = this.fontSize * this.stream.length
  }

  update() {
    this.y += this.speed;
    if (this.y > canvasHeight + this.size) this.reset(0)
    else if (Math.random() < charUpdateFrequency) 
      this.stream[getRandomInRange(0, this.stream.length)] = getRandomCharacter()
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = firstCharColor
    ctx.font = this.fontSize + 'px consolas'
    
    this.stream.map((s, i)=> {

      let opacity = 0;
      if (i > 5) opacity = (i - 5) / (this.stream.length - 5) 
      opacity = Math.max(((this.baseOpacity - opacity) * 255) | 0, 0)
      
      if (i === 0) ctx.fillStyle = `${firstCharColor}${opacity.toString(16)}`
      else ctx.fillStyle = `${charColor}${opacity.toString(16)}`
      
      ctx.fillText(s, this.x, this.y - i * this.fontSize)
    })
  }
}



const MatrixRain = () => {
  
  const nbStreams = 80;
  const streams = new Array(nbStreams).fill(undefined).map(_ => new Stream());

  const draw = (ctx: CanvasRenderingContext2D, frameCount: number) => {
    ctx.clearRect(0,0,canvasWidth, canvasHeight);
    streams.map(s => {
      s.update()
      s.draw(ctx)
    });
  }

  return (
    <div className='fill matrix-rain-canvas'>
      <Canvas width={canvasWidth} height={canvasHeight} draw={draw}/>
    </div>
  )
}

export default MatrixRain