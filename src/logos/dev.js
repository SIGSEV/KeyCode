import generateLogo from './generate-logo'
import teamIds from '../api/team-ids'

const style = document.createElement('style')
style.innerHTML = `
  canvas {
    margin: 10px;
  }
`

const button = document.createElement('button')
button.innerHTML = 'generate images'
button.style.display = 'block'

document.body.appendChild(button)
button.addEventListener('click', async () => {
  button.setAttribute('disabled', 'disabled')
  const allCanvas = [...document.querySelectorAll('canvas')]
  const allDataUrl = allCanvas.map(c => {
    const num = c.getAttribute('num')
    const data = c.toDataURL()
    return { num, data }
  })
  for (let i = 0; i < allDataUrl.length; i++) {
    await uploadLogo(allDataUrl[i])
  }
  button.removeAttribute('disabled')
})

document.head.appendChild(style)
document.body.style.backgroundColor = '#ddd'

const nums = Object.keys(teamIds)

nums.forEach(num => {
  const canvas = generateLogo(num)
  canvas.setAttribute('num', num)
  document.body.appendChild(canvas)
})

function uploadLogo(logo) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    const url = '/api/write-logo'
    xhr.open('POST', url, true)
    xhr.setRequestHeader('Content-type', 'application/json')
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve()
        } else {
          reject()
        }
      }
    }
    const data = JSON.stringify(logo)
    xhr.send(data)
  })
}
