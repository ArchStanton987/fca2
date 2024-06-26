export const add0WhenSingleDigit = (num: number) => (num < 10 ? `0${num}` : num)

export const getDDMMYYYY = (date: Date, separator: string = "/") => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${add0WhenSingleDigit(day)}${separator}${add0WhenSingleDigit(month)}${separator}${year}`
}

export const getHHMM = (date: Date, separator: string = ":") => {
  const hours = date.getHours()
  const minutes = date.getMinutes()
  return `${add0WhenSingleDigit(hours)}${separator}${add0WhenSingleDigit(minutes)}`
}

export const isISOString = (date: string) => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/
  return dateRegex.test(date)
}
