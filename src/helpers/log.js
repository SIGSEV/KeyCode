export function deserializeLog(log) {
  return log.split(' ').map(couple => {
    const t = couple.split('|')
    return {
      keycode: Number(t[0]),
      time: Number(t[1]),
    }
  })
}
