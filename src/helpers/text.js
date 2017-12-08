import shortid from 'shortid'
import { List, Map } from 'immutable'

export const languages = [
  'JavaScript',
  'Go',
  'Python',
  'Ruby',

  'Ada',
  'Brainfuck',
  'C',
  'Cpp',
  'Clojure',
  'CSS',
  'Elm',
  'HTML',
  'Rust',
  'Shell',
  'Swift',
  'TeX',
  'TypeScript',
  'VimScript',
  'Java',
  'PHP',
]

export const textConds = {
  min: 140,
  max: 1000,
}

export const lowerMap = languages.reduce((acc, l) => ((acc[l.toLowerCase()] = l), acc), {})
export const lowerArr = Object.keys(lowerMap)

export const promotedLanguages = ['JavaScript', 'Python', 'Go', 'Ruby']

export function countLinesOffset(chunks, start, end) {
  return chunks
    .slice(start, end)
    .reduce((count, word) => count + word.get('content').split('\n').length - 1, 0)
}

export function computeText(text) {
  if (!text) {
    return null
  }

  let trickyPrevIndexInLine = 0
  let line = 0
  text = text.replace(/\t/g, '  ')
  const chunks = text
    .split('')
    .reduce((acc, char, i) => {
      const nextChar = text[i + 1] || ''
      const prevChar = text[i - 1] || ''
      let word = acc.last()
      if (!word || word.get('done')) {
        word = Map({ start: i, done: false, id: shortid.generate() })
        acc = acc.push(word)
      }
      word = word.set('end', i)
      word = word.set('line', line)
      word = word.set(
        'content',
        text.substring(word.get('start'), word.get('end') + (i === text.length - 1 ? 2 : 1)),
      )
      if (char === '\n') {
        line += 1
      }
      if (!char.trim() && (char === '\n' || nextChar.trim() || prevChar.trim())) {
        word = word.set('done', true)
      } else {
        word = word.set('end', i)
      }
      acc = acc.set(acc.size - 1, word)
      return acc
    }, List())
    .map((word, i, words) => {
      const prev = i === 0 ? null : words.get(i - 1)
      const isNewLine = prev && prev.get('content').includes('\n')
      const indexInLine = prev
        ? isNewLine ? 0 : trickyPrevIndexInLine + prev.get('content').length
        : 0
      word = word.set('indexInLine', indexInLine)
      trickyPrevIndexInLine = indexInLine
      word = word.set('empty', !word.get('content').trim()).remove('done')
      return word
    })

  const wordsCount = chunks.filter(w => !w.get('empty')).size
  const linesCount = countLinesOffset(chunks, 0, chunks.size - 1)

  return Map({
    raw: text,
    chunks,
    wordsCount,
    linesCount,
  })
}
