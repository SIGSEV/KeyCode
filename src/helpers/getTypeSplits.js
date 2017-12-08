/**
 * Calculate all slices used to render the text in the race,
 * displaying cursor, players ghosts, wrong words, inactive
 * words, etc.
 *
 * Each "split" of the splits array have those keys:
 * {
 *   text       String        the text inside the node
 *   type       String        can be one of ['cursor', 'wrong', 'typed', 'untouched']
 *   players    Array         eventually contains players that are on that split
 * }
 */
export default function getTypeSplits(chunks, players) {
  const player = players.get(0)

  const cursor = player.get('cursor')
  const typedWord = player.get('typedWord')
  const wordIndex = player.get('wordIndex')
  const scrollY = player.get('scrollY')
  const maxDisplayedLines = player.get('maxDisplayedLines')

  const cursorsMap = getCursorMap(players)

  return chunks
    .reduce((acc, chunk, i) => {
      const line = chunk.get('line')
      if (line < scrollY || (maxDisplayedLines && line >= maxDisplayedLines)) {
        return acc
      }
      const isCurrentWord = wordIndex === i
      const chars = chunk.get('content').split('')
      const start = chunk.get('start')
      const isWrong = chunk.get('isWrong')

      const rest = chars.reduce((acc, char, i) => {
        const index = start + i
        const type =
          index === cursor
            ? 'cursor'
            : index > cursor
              ? 'untouched'
              : isCurrentWord && typedWord[i] !== char ? 'hardWrong' : isWrong ? 'wrong' : 'typed'
        const players = cursorsMap[index] || []
        const prev = acc[acc.length - 1]
        if (prev && prev.type === type && prev.players.length === players.length) {
          prev.text += char
        } else {
          acc.push({ text: char, type, players })
        }
        return acc
      }, [])

      return [...acc, ...rest]
    }, [])
    .reduce((acc, split) => {
      const prev = acc[acc.length - 1]
      if (prev && prev.type === split.type && prev.players.length === split.players.length) {
        prev.text += split.text
      } else {
        acc.push(split)
      }
      return acc
    }, [])
}

export function getCursorMap(players) {
  return players.reduce((map, player, i) => {
    const cursor = player.get('cursor')
    if (!map[cursor]) {
      map[cursor] = []
    }
    if (i !== 0) {
      map[cursor].push({ name: 'player' })
    }
    return map
  }, {})
}
