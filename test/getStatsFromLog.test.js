import getStatsFromLog from 'helpers/getStatsFromLog'
import omit from 'lodash/omit'

const EXCLUDED_KEYS = ['textId', 'time', 'log']
const EXCLUDED_ADDITIONAL = ['wrongKeys', 'validKeys']

function generateLog(string) {
  return string
    .split('')
    .map(char => `${char === '◀' ? -1 : char === '▼' ? 0 : char.charCodeAt()}|0`)
    .join(' ')
}

function expectStats(text, input, expected) {
  const log = generateLog(input)
  return expectStatsFromLog(text, log, expected)
}

function expectStatsFromLog(text, log, expected, { ignoreKeys = false } = {}) {
  const stats = getStatsFromLog(text, log)
  expect(omit(stats, [...EXCLUDED_KEYS, ...(ignoreKeys ? EXCLUDED_ADDITIONAL : [])])).toEqual(
    expected,
  )
}

test('should calculate correct stats with a dumby sample', () => {
  expectStats('aaa aaa', 'aaa aaa', {
    corrections: 0,
    typedWordsCount: 2,
    wrongWordsCount: 0,
    validKeys: { '97': 6, '32': 1 },
    wrongKeys: {},
  })
})

test('should handle backspace', () => {
  expectStats('aaa aaa', 'aaa b◀aaa', {
    corrections: 1,
    typedWordsCount: 2,
    wrongWordsCount: 0,
    validKeys: { '97': 6, '32': 1 },
    wrongKeys: { '97': 1 },
  })
})

test('should have no effect to type enter inside a word', () => {
  expectStats('aaa aaa', 'aaa a▼▼▼aa', {
    corrections: 0,
    typedWordsCount: 2,
    wrongWordsCount: 0,
    validKeys: { '97': 6, '32': 1 },
    wrongKeys: {},
  })
})

test('should validate word when typing enter at the end', () => {
  expectStats('aaa aaa', 'aaa▼aaa', {
    corrections: 0,
    typedWordsCount: 2,
    wrongWordsCount: 0,
    validKeys: { '97': 6 },
    wrongKeys: {},
  })
})

test('should work using real world example', () => {
  const text =
    "import texts from 'reducers/texts'\nimport leaders from 'reducers/leaders'\nimport toasts from 'reducers/toasts'\n\nexport default combineReducers({\n  router,\n  modals,\n  race,\n  user,\n  texts,\n  leaders,\n  toasts,\n})"
  const log =
    '105|0 109|202 112|210 111|69 114|202 116|248 0|361 116|664 101|235 120|234 116|299 32|514 0|1344 102|783 114|155 111|85 109|57 0|234 39|523 114|204 101|150 100|184 117|100 99|134 101|175 115|164 116|298 -1|682 -1|174 114|525 115|243 47|467 116|379 101|82 120|220 116|206 115|266 39|886 0|250 105|593 109|194 112|188 111|59 114|113 116|186 0|220 108|203 101|162 97|68 100|184 101|161 114|181 115|255 0|555 109|931 108|219 107|214 108|310 0|362 39|977 114|190 101|171 100|534 117|154 99|479 101|198 114|239 115|479 -1|265 -1|174 -1|101 -1|109 -1|121 -1|111 -1|124 -1|121 114|810 101|176 100|395 117|107 99|181 101|187 114|185 115|194 47|426 108|241 101|172 97|112 100|184 101|170 114|554 115|209 39|714 0|214 105|663 109|181 112|186 111|55 114|103 116|188 0|234 116|160 101|282 -1|820 111|322 97|268 115|242 116|222 115|234 0|233 102|217 114|160 111|125 109|34 0|148 39|898 114|193 101|160 100|171 117|84 99|104 101|174 114|185 115|189 47|368 116|578 111|191 97|116 115|239 116|212 115|207 39|613 0|253 101|590 120|202 112|118 111|59 114|65 116|171 0|128 100|103 101|198 102|168 97|175 117|125 108|50 116|83 0|145 99|250 111|179 109|269 98|286 105|259 108|58 -1|469 110|225 101|96 82|461 101|226 100|194 117|98 99|125 101|172 114|165 115|185 40|316 123|801 0|452 114|652 111|56 117|48 116|84 101|172 114|139 44|284 0|414 109|501 111|74 100|66 97|190 108|102 115|144 44|223 0|311 114|285 97|148 99|203 101|174 44|125 0|315 117|360 115|70 101|160 114|173 44|651 0|225 116|791 101|48 120|187 116|120 115|773 44|192 0|323 108|1055 101|63 97|81 100|221 101|176 114|185 115|190 44|163 0|296 116|516 111|106 97|112 115|154 116|201 115|195 44|156 0|226 125|812 41|180'
  const expected = {
    corrections: 12,
    wrongWordsCount: 2,
    typedWordsCount: 23,
  }
  expectStatsFromLog(text, log, expected, { ignoreKeys: true })
})
