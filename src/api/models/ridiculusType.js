// ridiculus, axio baguette!
// https://github.com/Automattic/mongoose/issues/681

export default {
  type: String,
  get: data => {
    try {
      return JSON.parse(data)
    } catch (e) {
      return data
    }
  },
  set: data => JSON.stringify(data),
  default: '{}',
}
