import React, { useEffect, useRef } from 'react'

interface CanvasT {
  width: number,
  height: number,
  draw(context: CanvasRenderingContext2D, frame:number): void 
}

const Canvas = ({width, height, draw}: CanvasT) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(()=>{
    const canvas = canvasRef.current;
    if (!canvas) return

    const ctx = canvas.getContext('2d');
    if (!ctx) return

    let frameCount = 0;
    let animationFrameID = 0;

    const render = () => {
      frameCount++;
      draw(ctx, frameCount)
      animationFrameID = window.requestAnimationFrame(render)
    }
      render()
    return () => window.cancelAnimationFrame(animationFrameID)
  }, [draw])

  return (
    <canvas ref={canvasRef} style={{backgroundColor: 'black'}} width={width} height={height} />
  )
}

export default Canvas