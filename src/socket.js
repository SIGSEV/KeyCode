import io from 'socket.io-client'

let socket = null

export const initSocket = (store, jwt) => {
  socket = io.connect(__URL__, { query: `token=${jwt}` })
}

export const notifyStart = () => socket.emit('startRace')
