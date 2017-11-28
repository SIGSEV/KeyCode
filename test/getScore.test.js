import getScore from 'helpers/getScore'

test('should correctly calculate cpm with the dumbest stats', () => {
  const stats = {
    time: 60,
    wrongWordsCount: 0,
    validKeys: { '97': 60 },
    wrongKeys: {},
  }
  const expected = {
    wrongCharsScore: 0,
    wrongCharsStats: {},
    correctCharsScore: 60,
    correctCharsStats: {
      lower: 60,
    },
    premiumBonus: 0,
    cpm: 60,
    wpm: 12,
  }
  expect(getScore(stats)).toEqual(expected)
})

test('should give a better score for uppercase letters', () => {
  const stats = {
    time: 60,
    wrongWordsCount: 0,
    validKeys: { '97': 40, '65': 20 },
    wrongKeys: {},
  }
  const expected = {
    wrongCharsScore: 0,
    wrongCharsStats: {},
    correctCharsScore: 76,
    correctCharsStats: {
      lower: 40,
      upper: 20,
    },
    premiumBonus: 0,
    cpm: 76,
    wpm: 15,
  }
  expect(getScore(stats)).toEqual(expected)
})

test('should add a bonus for premium', () => {
  const stats = {
    time: 60,
    wrongWordsCount: 0,
    validKeys: { '97': 40, '65': 20 },
    wrongKeys: {},
  }
  expect(getScore(stats).wpm).toEqual(15)
  expect(getScore(stats, 20).wpm).toEqual(35)
})
