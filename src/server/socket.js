import get from 'lodash/get'

import { setRetryCtx } from 'api/services/user'

export default function handleIO(io) {
  io.on('connection', socket => {
    const id = get(socket, 'decoded_token.id')

    socket.on('startRace', () => {
      if (!id) {
        return
      }

      setRetryCtx(id, 'inc')
    })
  })
}
