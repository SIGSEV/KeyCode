import fs from 'fs'
import path from 'path'

export default function writeLogo(logo) {
  const { suffix, data } = logo
  const base64 = data.split(',')[1]
  const imgName = `${suffix}.png`
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
