// Coordinate conversion between canvas display space and image natural space

export interface ScaleInfo {
  x: number     // scale factor (display / natural)
  y: number
  offX: number  // canvas offset where image starts
  offY: number
  dispW: number
  dispH: number
}

export function canvasToImage(canvasX: number, canvasY: number, scale: ScaleInfo) {
  return {
    x: (canvasX - scale.offX) / scale.x,
    y: (canvasY - scale.offY) / scale.y,
  }
}

export function imageToCanvas(imageX: number, imageY: number, scale: ScaleInfo) {
  return {
    x: scale.offX + imageX * scale.x,
    y: scale.offY + imageY * scale.y,
  }
}
