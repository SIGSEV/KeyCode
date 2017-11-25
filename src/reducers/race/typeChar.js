import { countLinesOffset } from 'helpers/text'

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

export default function typeChar(state, charCode) {
  switch (charCode) {
    case 0:
      return typeEnter(state)
    case -1:
      return typeBackspace(state)
    default:
      return typeRegular(state, String.fromCharCode(charCode))
  }
}

function nextWord(state, { isCorrectTrigger = true } = {}) {
  let chunks = state.getIn(['text', 'chunks'])
  let p = state.getIn(['players', 0])

  const maxDisplayedLines = p.get('maxDisplayedLines')
  const wordIndex = p.get('wordIndex')
  const typedWord = p.get('typedWord')

  const nextWordIndex = chunks.findIndex((w, i) => i > wordIndex && !w.get('empty'))
  const word = chunks.get(wordIndex)
  const jumps = countLinesOffset(chunks, wordIndex, nextWordIndex)

  if (jumps > 0) {
    const scrollY = p.get('scrollY')
    const nextLine = p.get('line') + jumps
    const linesCount = state.getIn(['text', 'linesCount'])
    p = p.set('line', nextLine)
    const isLowerThanMiddle = nextLine - scrollY > maxDisplayedLines / 2 - 1
    const isNotEndOfText = linesCount - scrollY > maxDisplayedLines - 1
    if (isLowerThanMiddle && isNotEndOfText) {
      p = p.set('scrollY', scrollY + 1)
    }
  }

  if (!isCorrectTrigger || !typedWord || typedWord.trim() !== word.get('content').trim()) {
    chunks = chunks.setIn([wordIndex, 'isWrong'], true)
  }

  if (chunks.getIn([wordIndex, 'isWrong'])) {
    p = p.set('wrongWordsCount', p.get('wrongWordsCount', 0) + 1)
  }

  p = p.set('typedWordsCount', p.get('typedWordsCount') + 1)

  if (nextWordIndex === -1) {
    p = p.set('cursor', word.get('end') + 1)
  } else {
    const nextWord = chunks.get(nextWordIndex)
    p = p
      .set('wordIndex', nextWordIndex)
      .set('cursor', nextWord.get('start'))
      .set('typedWord', '')
  }
  p = adjustScrollX(p, state.getIn(['text', 'chunks']))

  return state.setIn(['players', 0], p).setIn(['text', 'chunks'], chunks)
}

function typeRegular(state, char) {
  let p = state.getIn(['players', 0])
  let text = state.get('text')

  const raw = text.get('raw')
  const cursor = p.get('cursor')
  const wordIndex = p.get('wordIndex')
  const typedWord = p.get('typedWord')
  const newTypedWord = `${typedWord}${char}`
  const charToType = raw[cursor]
  const charCode = charToType.charCodeAt()

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

  // end of text
  if (cursor === raw.length - 1) {
    state = nextWord(state)
  } else if (!charToType || !charToType.trim()) {
    // end of word
    const hasTypedSpace = char === ' '
    state = nextWord(state, { isCorrectTrigger: hasTypedSpace })
  }

  return state
}

function typeEnter(state) {
  const p = state.getIn(['players', 0])
  const text = state.get('text')
  const raw = text.get('raw')
  const cursor = p.get('cursor')
  const charToType = raw[cursor]
  if (!charToType || !charToType.trim()) {
    return nextWord(state)
  }
  return state
}

function typeBackspace(state) {
  let chunks = state.getIn(['text', 'chunks'])
  let p = state.getIn(['players', 0])
  const cursor = p.get('cursor')
  const wordIndex = p.get('wordIndex')
  const word = chunks.get(wordIndex)
  if (cursor === word.get('start')) {
    return state
  }

  const typedWord = p.get('typedWord')
  const newTypedWord = typedWord.substr(0, typedWord.length - 1)

  p = p
    .set('cursor', cursor - 1)
    .set('typedWord', newTypedWord)
    .set('corrections', p.get('corrections') + 1)

  p = adjustScrollX(p, state.getIn(['text', 'chunks']))

  if (word.get('content').startsWith(newTypedWord)) {
    chunks = chunks.setIn([wordIndex, 'isWrong'], false)
  }
  return state.setIn(['players', 0], p).setIn(['text', 'chunks'], chunks)
}
