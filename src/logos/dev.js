import generateLogo from './generate-logo'
import teamIds from '../api/team-ids'

const style = document.createElement('style')
style.innerHTML = `
  @font-face {
    font-family: 'Inter UI Black';
    font-weight: normal;
    font-style: normal;
    src: url('../src/assets/fonts/inter/Inter-UI-Black.woff2') format('woff2');
  }

  body {
    font-family: "Inter UI Black";
    background-color: #ddd;
  }

  canvas {
    margin: 10px;
  }
`

document.head.appendChild(style)

/**
 * Layout
 */

const text = document.createElement('div')
text.innerHTML = 'KeyCode-logo generator'
document.body.appendChild(text)

const makeBtn = text => {
  const button = document.createElement('button')
  button.innerHTML = text
  button.style.display = 'block'
  document.body.appendChild(button)
  return button
}

const genBtn = makeBtn('generate')
const upBtn = makeBtn('upload')

const root = document.createElement('div')
document.body.appendChild(root)

/**
 * Events
 */

const addCanvas = suffix => {
  const canvas = generateLogo(suffix)
  canvas.setAttribute('suffix', suffix)
  root.appendChild(canvas)
}

const gen = () => {
  const orgs = Object.keys(teamIds)
  root.innerHTML = null
  orgs.forEach(addCanvas)
}

gen()

genBtn.addEventListener('click', gen)

upBtn.addEventListener('click', async () => {
  upBtn.setAttribute('disabled', 'disabled')
  const allCanvas = [...document.querySelectorAll('canvas')]
  const allDataUrl = allCanvas.map(c => {
    const suffix = c.getAttribute('suffix')
    const data = c.toDataURL()
    return { suffix, data }
  })

  for (let i = 0; i < allDataUrl.length; i++) {
    await uploadLogo(allDataUrl[i])
  }

  upBtn.removeAttribute('disabled')
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
