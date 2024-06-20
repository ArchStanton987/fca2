/* eslint-disable import/prefer-default-export */
export const fillZeros = (num: number) => {
  const str = num.toString()
  if (num < 10) {
    return `00${str}`
  }
  if (num < 100) {
    return `0${str}`
  }
  return str
}
