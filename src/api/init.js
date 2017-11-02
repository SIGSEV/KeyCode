import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.load()

mongoose.Promise = Promise
mongoose.connect('mongodb://localhost:27017/keycode', { useMongoClient: true })
