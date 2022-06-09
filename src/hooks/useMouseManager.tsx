import { RefObject, useEffect, useRef, useState } from "react";
import { Vector2d } from "../components/creative-coding/utils/Interfaces";

interface MouseButton {
  pressed: boolean
  time: number
}

class Mouse {
  button: MouseButton[] // 0 left, 1 right, 2 middlemouse
  position: Vector2d

  constructor() {
    this.button = new Array(3).fill({
      pressed: false,
      time: Date.now()
    })

    this.position = { x: 0, y: 0 }
  }
}

export function useMouseManager(canvasRef: RefObject<HTMLCanvasElement>) : Mouse {

  const mouse = new Mouse();
  
  useEffect(() => {
    if (!canvasRef || !canvasRef.current) return
    const _canvasRef = canvasRef.current; // need an immutable instance for cleanup func

    const mouseButtonDown = (event: MouseEvent) => {
      if (event instanceof MouseEvent) {
        mouse.button[event.button].pressed = true
        mouse.button[event.button].time = Date.now()
      }
    }

    const mouseButtonUp  = (event: MouseEvent) => {
      if (event !instanceof MouseEvent) {
        mouse.button[event.button].pressed = false
        mouse.button[event.button].time = Date.now()
      }
    }

    const mouseMoved = (event: MouseEvent) => {
      if (event instanceof MouseEvent) {
        mouse.position = { x: event.offsetX, y: event.offsetY }
      }
    }

    _canvasRef.addEventListener('mousemove', mouseMoved)
    _canvasRef.addEventListener('mousedown', mouseButtonDown)
    _canvasRef.addEventListener('mouseup', mouseButtonUp)

    return () => {
      _canvasRef.removeEventListener('mousemove', mouseMoved)
      _canvasRef.removeEventListener('mousedown', mouseButtonDown)
      _canvasRef.removeEventListener('mouseup', mouseButtonUp)
    }
  }, [])
  
  return  mouse;
}
