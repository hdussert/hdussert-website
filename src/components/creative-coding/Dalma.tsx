import React, { useContext, useEffect, useRef } from 'react'
import Canvas from './Canvas';
import { ParticleWithOrigin } from './classes/ParticleWithOrigin';
import { CreativeProjectContext } from './CreativeProject';
import { getRandomInRange, getRandomInRangeFloat } from './utils/Maths';

const Dalma = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctx = useRef<CanvasRenderingContext2D|null>()
  const context = useContext(CreativeProjectContext)
  const canvasWidth = context?.width || 0
  const canvasHeight = context?.height || 0

  const points = useRef<ParticleWithOrigin[]>([])
  
  const text = 'Dalma'
  useEffect(() => {
    if (!canvasRef.current) return
    ctx.current = canvasRef.current.getContext('2d')
    if (!ctx.current) return
    
    ctx.current.clearRect(0,0,canvasWidth, canvasHeight);
    ctx.current.font = `200px Futura`
    ctx.current.fillStyle = '#FFF'
    ctx.current.fillText(text, canvasWidth/2 - 280, canvasHeight/2);
    
    points.current = [];
    var pixels = ctx.current.getImageData(0,0,canvasWidth, canvasHeight).data;
    
    for (let x = 0; x < canvasWidth; x+= 5) {
      for (let y = 0; y < canvasHeight; y+= 5) {
        
        const alpha = pixels[(y * canvasWidth + x) * 4 + 3]; 
        if (alpha <= 0) continue

        points.current?.push(
          new ParticleWithOrigin (
            ctx.current, 
            1 + Math.random() * canvasWidth, 1 + Math.random() * canvasHeight, 
            x, y, 
            getRandomInRangeFloat(- Math.PI, Math.PI),
            getRandomInRange(2,4),
            getRandomInRange(1,5),
            '#FFF',
            canvasWidth, canvasHeight
          )
        )
      }
    }
    ctx.current.clearRect(0,0,canvasWidth, canvasHeight);

    setTimeout(()=> {
      points.current.forEach(p => p.backToOrigin = true)
    }, 5000)
  }, [])

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = 'rgb(78, 104, 246)'
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    points.current?.forEach(p => {
      p.animate();
    })
  }

  return (
    <div>
      <Canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} draw={draw} fpsCap={60}/>
    </div>
  )
}

export default Dalma