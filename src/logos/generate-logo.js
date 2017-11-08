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

export default function generateLogo(num, opts = {}) {
  const { size = 90 } = opts
  const canvas = createHiDPICanvas(size)
  const ctx = canvas.getContext('2d')

  // white background
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = 'black'

  // K
  const kSize = 30
  ctx.fillStyle = '#aaa'
  // ctx.fillStyle = 'rgba(22, 135, 238, 0.7)'
  ctx.font = `${kSize}px "Inter UI Black"`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillText('K', size / 2, size - kSize - 10)

  // num
  const numSize = 45
  ctx.fillStyle = 'black'
  // ctx.fillStyle = '#1687ee'
  ctx.font = `${numSize}px "Inter UI Black"`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillText(num, size / 2, 5)

  return canvas
}
