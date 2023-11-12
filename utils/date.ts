export const add0WhenSingleDigit = (num: number) => (num < 10 ? `0${num}` : num)

export const getDDMMYYYY = (date: Date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return `${add0WhenSingleDigit(day)}/${add0WhenSingleDigit(month)}/${year}`
}
