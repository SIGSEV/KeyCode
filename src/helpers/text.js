import shortid from 'shortid'
import { List, Map } from 'immutable'

export const languages = [
  'JavaScript',
  'Ada',
  'Brainfuck',
  'C',
  'Cpp',
  'Clojure',
  'CSS',
  'Elm',
  'Go',
  'HTML',
  'Python',
  'Ruby',
  'Rust',
  'Shell',
  'Swift',
  'TeX',
  'TypeScript',
  'VimScript',
  'Java',
  'PHP',
]

export const lowerMap = languages.reduce((acc, l) => ((acc[l.toLowerCase()] = l), acc), {})

export const promotedLanguages = ['JavaScript', 'Python', 'Go', 'Ruby']

export function countLinesOffset(chunks, start, end) {
  return chunks
    .slice(start, end)
    .reduce((count, word) => count + word.get('content').split('\n').length - 1, 0)
}

export function computeText(text) {
  const chunks = text
    .split('')
    .reduce((acc, char, i) => {
      let word = acc.last()
      if (!word || word.get('done')) {
        word = Map({ start: i, done: false, id: shortid.generate() })
        acc = acc.push(word)
      }
      word = word.set('end', i)
      word = word.set(
        'content',
        text.substring(word.get('start'), word.get('end') + (i === text.length - 1 ? 2 : 1)),
      )
      if (!char.trim()) {
        word = word.set('done', true)
      } else {
        word = word.set('end', i)
      }
      acc = acc.set(acc.size - 1, word)
      return acc
    }, List())
    .map(word => word.set('empty', !word.get('content').trim()).remove('done'))

  const wordsCount = chunks.filter(w => !w.get('empty')).size
  const linesCount = countLinesOffset(chunks, 0, chunks.size - 1)

  return Map({
    raw: text,
    chunks,
    wordsCount,
    linesCount,
  })
}
