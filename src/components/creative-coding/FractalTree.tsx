import React, { useContext, useRef } from 'react'
import Canvas from './Canvas'
import { CreativeProjectContext } from './CreativeProject';
import { degreeToRadian } from './utils/Maths';

//--
const FractalTree = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rendered = useRef(false);
  
  const context = useContext(CreativeProjectContext);
  const canvasWidth = context?.width || 0
  const canvasHeight = context?.height || 0
  
  let angleLeft = 36;
  let angleRight = 36;

  const drawTree = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, iteration: number) => {
    
    ctx.translate(x,y)

    for (let i = 0; i < iteration; i++) {

      ctx.beginPath()
      let r1x = Math.random() * size - size/2;
      let r1y = Math.random() * size - size/2;
      let r2x = Math.random() * size - size/2;
      let r2y = Math.random() * size - size/2;

      if (iteration === 1)  {
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#33AA00'
      }
      else {
        ctx.lineWidth = size / 10;
        ctx.strokeStyle = '#774422'
      }

      ctx.save()
      ctx.moveTo(0, 0)
      ctx.rotate(degreeToRadian(angleLeft))
      ctx.bezierCurveTo(r1x, r1y, r2x, r2y, 0, -size)
      if (iteration === 1) ctx.ellipse(0, 0, 2, 2, 0, 0, 360)
      ctx.restore()
      ctx.stroke()
      ctx.closePath()

      ctx.beginPath()
      ctx.save()
      ctx.moveTo(0,0)
      ctx.rotate(degreeToRadian(-angleRight))
      ctx.bezierCurveTo(r1x, r1y, r2x, r2y, 0, -size)
      if (iteration === 1) ctx.ellipse(0, 0, 2, 2, 0, 0, 360)
      ctx.restore()
      ctx.stroke()
      ctx.closePath()
    }

    ctx.rotate(degreeToRadian(angleLeft))
    if (iteration > 1) drawTree(ctx, 0, -size, size * .7, iteration - 1)
    ctx.rotate(degreeToRadian(-angleLeft-angleRight))
    if (iteration > 1) drawTree(ctx, 0, -size, size * .7, iteration - 1)
    ctx.rotate(degreeToRadian(angleRight))
    ctx.translate(-x, -y)
  }

  const draw = (ctx: CanvasRenderingContext2D, frameCount: number) => {
    if (rendered.current) return
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    ctx.translate(canvasWidth / 2, canvasHeight)
    for (let i = 0; i < 9; i++) {
      ctx.beginPath()
      let r1x = Math.random() * 150 - 75;
      let r1y = Math.random() * 150 - 75;
      let r2x = Math.random() * 150 - 75;
      let r2y = Math.random() * 150 - 75;
      ctx.moveTo(0,50)
      ctx.bezierCurveTo(r1x, r1y, r2x, r2y, 0, -canvasHeight/3)
      ctx.lineWidth = 25;
      ctx.strokeStyle = '#774422'
      ctx.shadowColor = '#000'
      ctx.shadowBlur = 7
      ctx.stroke()
      ctx.closePath()
    }
    ctx.translate(-canvasWidth / 2, -canvasHeight)


    drawTree(ctx, canvasWidth / 2, 2 * canvasHeight / 3, 120, 8);
    rendered.current = true;
  }

  const changeAngleLeft = (e: React.ChangeEvent<HTMLInputElement>)  => {
    angleLeft = Number(e.target.value);
    rendered.current = false;
  }

  const changeAngleRight = (e: React.ChangeEvent<HTMLInputElement>)  => {
    angleRight = Number(e.target.value);
    rendered.current = false;
  }

  return (
    <div className='fill phyllotaxis'>
      <div className='phyllotaxis-inputs'>
        <div>
          <input onChange={changeAngleLeft} defaultValue={angleLeft} type="range" id="angleleft" name="Angle Left" min={15} max={90} step={'0.01'}/>
          <label htmlFor="angleleft">Angle left</label><br/>
          
          <input onChange={changeAngleRight} defaultValue={angleRight} type="range" id="angleright" name="Angle Right" min={15} max={90} step={'0.01'}/>
          <label htmlFor="angleright">Angle right</label><br/>
          
        </div>
      </div>
      <Canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} draw={draw} fpsCap={60}/>
    </div>
  )
}

export default FractalTree