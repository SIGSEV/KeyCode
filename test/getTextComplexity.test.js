import getTextComplexity from 'helpers/getTextComplexity'

test('should detect a baby test', () => {
  const text = 'aaa aaa aaa aaa'
  expect(getTextComplexity(text)).toBe(1)
})
