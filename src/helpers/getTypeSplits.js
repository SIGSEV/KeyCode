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
  const currentCursor = players.getIn([0, 'cursor'])
  const cursorsMap = getCursorMap(players)
  return chunks
    .reduce((acc, chunk) => {
      const chars = chunk.get('content').split('')
      const start = chunk.get('start')
      const isWrong = chunk.get('isWrong')

      const rest = chars.reduce((acc, char, i) => {
        const index = start + i
        const type =
          index === currentCursor
            ? 'cursor'
            : index > currentCursor ? 'untouched' : isWrong ? 'wrong' : 'typed'
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
    map[cursor].push({
      isCurrent: i === 0,
    })
    return map
  }, {})
}
