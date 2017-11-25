/**
 * Estimate complexity of the given text
 *
 * 1: Baby test
 * 2: Easy and chill
 * 3: Fluid
 * 4: Medium
 * 5: Hardcore
 */

const LEVELS = [[1, 5], [2, 15], [3, 30], [4, 50], [5, Infinity]]

export default function getTextComplexity(text) {
  const diversityMap = {}
  let rawComplexity = 0
  text.split('').forEach((char, i) => {
    const lastChar = text[i - 1] || false
    const code = char.charCodeAt()
    const isBlank = !char.trim()
    if (!isBlank) {
      if (!diversityMap[code]) {
        diversityMap[code] = 1
      } else {
        diversityMap[code] += 1
      }
    }
    // we assume that it is instant to type the same char
    if (lastChar && lastChar === char) {
      rawComplexity -= 1
      return
    }
    switch (true) {
      // space char
      case isBlank:
        rawComplexity += 1
        break
      // lower alpha
      case code > 96 && code < 123:
        rawComplexity += 1
        break
      // upper alpha
      case code > 64 && code < 91:
        rawComplexity += 2
        break
      // numeric
      case code > 47 && code < 58:
        rawComplexity += 3
        break
      // special char
      default:
        rawComplexity += 3
        break
    }
  })
  const diverseChars = Object.keys(diversityMap).length
  const total = rawComplexity + diverseChars
  LEVELS.forEach(level => {
    const [complexity, max] = level
    if (total <= max) {
      return complexity
    }
  })
  return 1
}
