import reduce from 'lodash/reduce'

const CHAR_TYPES_VAL = {
  lower: 1,
  upper: 1.8,
  special: 2,
  number: 2,
}

function getCharType(keyCode) {
  switch (true) {
    case keyCode > 47 && keyCode < 58:
      return 'number'
    case keyCode > 64 && keyCode < 91:
      return 'upper'
    case keyCode > 96 && keyCode < 123:
      return 'lower'
    default:
      return 'special'
  }
}

function getCharsStats(keys) {
  return reduce(
    keys,
    (acc, nb, keyCode) => {
      const charType = getCharType(keyCode)
      if (!acc[charType]) {
        acc[charType] = 0
      }
      acc[charType] += nb
      return acc
    },
    {},
  )
}

function getCharsScore(charsStats) {
  return reduce(
    charsStats,
    (acc, nb, type) => {
      return acc + CHAR_TYPES_VAL[type] * nb
    },
    0,
  )
}

export default function getScore(stats, premiumBonus = 0) {
  const { time, wrongWordsCount, validKeys, wrongKeys } = stats
  const minuteRatio = (time || 1) / 60

  const correctCharsStats = getCharsStats(validKeys)
  const wrongCharsStats = getCharsStats(wrongKeys)
  const correctCharsScore = getCharsScore(correctCharsStats)
  const wrongCharsScore = getCharsScore(wrongCharsStats)

  const charsScore = Math.max(0, correctCharsScore - wrongCharsScore)

  const cpm = Math.round(charsScore / minuteRatio)
  const wpm = Math.round(cpm / 5) - wrongWordsCount + premiumBonus

  return {
    correctCharsStats,
    wrongCharsStats,
    correctCharsScore,
    wrongCharsScore,
    premiumBonus,
    cpm,
    wpm,
  }
}
