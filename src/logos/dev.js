import generateLogo from './generate-logo'
import teamIds from '../api/team-ids'

const style = document.createElement('style')
style.innerHTML = `
  canvas {
    margin: 10px;
  }
`
document.head.appendChild(style)
document.body.style.backgroundColor = '#ddd'

const nums = Object.keys(teamIds)

nums.forEach(num => {
  const canvas = generateLogo(num)
  document.body.appendChild(canvas)
})
