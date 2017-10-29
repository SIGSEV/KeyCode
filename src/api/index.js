import express from 'express'

const api = express.Router()

api.get('/', (req, res) => res.send(true))

export default api
