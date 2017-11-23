const DISPLAYED_COLS = 120

function adjustScrollX(p, chunks) {
  const word = chunks.get(p.get('wordIndex'))
  const cursorIndexInLine = p.get('cursor') - word.get('start') + word.get('indexInLine')
  if (cursorIndexInLine > DISPLAYED_COLS / 2) {
    p = p.set('scrollX', cursorIndexInLine - DISPLAYED_COLS / 2)
  } else {
    p = p.set('scrollX', 0)
  }
  return p
}

export default function typeChar(state, { payload: charCode }) {
  switch (charCode) {
    case 0:
      return typeEnter(state)
    case -1:
      return typeBackspace(state)
    default:
      return typeRegular(state, String.fromCharCode(charCode))
  }
}

function typeRegular(state, char) {
  let p = state.getIn(['players', 0])
  let text = state.get('text')

  const cursor = p.get('cursor')
  const wordIndex = p.get('wordIndex')
  const typedWord = p.get('typedWord')
  const newTypedWord = `${typedWord}${char}`
  const charToType = state.getIn(['text', 'raw'])[cursor]
  const charCode = char.charCodeAt()

  p = p
    .update(charToType === char ? 'validKeys' : 'wrongKeys', keys =>
      keys.set(charCode, keys.get(charCode, 0) + 1),
    )
    .set('typedChar', char)
    .set('cursor', cursor + 1)
    .set('typedWord', newTypedWord)

  p = adjustScrollX(p, state.getIn(['text', 'chunks']))

  const word = text.getIn(['chunks', wordIndex])

  if (!word.get('content').startsWith(newTypedWord)) {
    text = text.setIn(['chunks', wordIndex, 'isWrong'], true)
  }

  state = state.setIn(['players', 0], p)
  state = state.setIn('text', text)

  return state
}

function typeEnter(state) {
  return state
}

function typeBackspace(state) {
  return state
}
