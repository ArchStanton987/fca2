/* eslint-disable import/prefer-default-export */
export function delay<T>(t: number, val: T) {
  return new Promise<T>(resolve => {
    setTimeout(() => resolve(val), t)
  })
}
