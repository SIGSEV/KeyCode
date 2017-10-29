import express from 'express'
import fetch from 'node-fetch'

const api = express.Router()

const GITHUB_BASE = 'https://api.github.com/graphql'

api.post('/graphql', async (req, res) => {
  try {
    const r = await fetch(GITHUB_BASE, {
      method: 'POST',
      body: JSON.stringify(req.body),
      headers: {
        Authorization: `bearer ${process.env.GITHUB_TOKEN}`,
      },
    })
    const json = await r.json()
    res.send(json)
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
})

export default api
