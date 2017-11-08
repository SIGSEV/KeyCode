import fs from 'fs'
import path from 'path'

export default function writeLogo(logo) {
  const { num, data } = logo
  const base64 = data.split(',')[1]
  const imgName = `${num}.png`
  const imgPath = path.resolve(__dirname, 'output', imgName)
  return new Promise((resolve, reject) => {
    fs.writeFile(imgPath, base64, 'base64', err => {
      if (err) {
        return reject(err)
      }
      resolve()
    })
  })
}
