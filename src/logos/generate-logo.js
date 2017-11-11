import { getColor, getTextColor } from '../../src/helpers/colors'

const PIXEL_RATIO = (function() {
  const ctx = document.createElement('canvas').getContext('2d')
  const dpr = window.devicePixelRatio || 1
  const bsr =
    ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    ctx.backingStorePixelRatio ||
    1
  return dpr / bsr
})()

function createHiDPICanvas(size) {
  const can = document.createElement('canvas')
  can.width = size * PIXEL_RATIO
  can.height = size * PIXEL_RATIO
  can.style.width = `${size}px`
  can.style.height = `${size}px`
  can.getContext('2d').setTransform(PIXEL_RATIO, 0, 0, PIXEL_RATIO, 0, 0)
  return can
}

export default function generateLogo(suffix, opts = {}) {
  const { size = 90 } = opts
  const canvas = createHiDPICanvas(size)
  const ctx = canvas.getContext('2d')
  const isNum = !isNaN(suffix)

  // background
  ctx.fillStyle = isNum ? 'white' : getColor(suffix)
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // K
  const kSize = 30
  ctx.fillStyle = isNum ? '#aaa' : getTextColor(getColor(suffix))
  // ctx.fillStyle = 'rgba(22, 135, 238, 0.7)'
  ctx.font = `${kSize}px "Inter UI Black"`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillText('K', size / 2, isNum ? size - kSize - 10 : size / 2 - kSize / 2)

  if (isNum) {
    // num
    const numSize = 45
    ctx.fillStyle = 'black'
    // ctx.fillStyle = '#1687ee'
    ctx.font = `${numSize}px "Inter UI Black"`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.fillText(suffix, size / 2, 5)
  }

  return canvas
}
