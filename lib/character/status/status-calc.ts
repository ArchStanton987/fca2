/* eslint-disable import/prefer-default-export */
export const getLevelAndThresholds = (exp: number) => {
  let level = 1
  let next = 1000
  let prev = 0
  while (next < exp) {
    prev = next
    level += 1
    next += level * 1000
  }
  return { level, prev, next }
}
