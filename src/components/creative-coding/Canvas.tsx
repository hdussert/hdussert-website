import React, { forwardRef, memo, useEffect, useImperativeHandle, useRef } from 'react'

interface CanvasT {
  width: number,
  height: number,
  draw(context: CanvasRenderingContext2D, frame:number): void 
  fpsCap: number
}

const Canvas = forwardRef<HTMLCanvasElement, CanvasT>(({width, height, draw, fpsCap}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const lastTime = useRef(0);
  const timer = useRef(0);

  useEffect(()=>{
    const canvas = canvasRef.current;
    if (!canvas) return
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return
    
    let frameCount = 0;
    let animationFrameID = 0;
    let timePerFrame = 1000 / fpsCap
    const render = (timeStamp: number) => {
      const deltaTime = timeStamp - lastTime.current
      lastTime.current = timeStamp
      if (timer.current > timePerFrame) {
        frameCount++;
        draw(ctx, frameCount)
        timer.current = 0
      }
      else timer.current += deltaTime;
      animationFrameID = window.requestAnimationFrame(render)
    }
    render(0)
    return () => window.cancelAnimationFrame(animationFrameID);
  }, [draw, fpsCap])
  
  useImperativeHandle(ref, ()=> canvasRef.current!, [canvasRef])
  console.log('CANVAS RENDERED')  
  return (
    <canvas ref={canvasRef} style={{backgroundColor: '#0F0F00'}} width={width} height={height} />
  )
})

export default memo(Canvas)