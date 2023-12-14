/* eslint-disable import/prefer-default-export */
export const filterUnique = <T, K extends keyof T>(key: K, arr: T[]) => {
  if (!Array.isArray(arr)) {
    return []
  }
  const seen = new Set()
  return arr.filter(el => {
    const k = el[key]
    return seen.has(k) ? false : seen.add(k)
  })
}
