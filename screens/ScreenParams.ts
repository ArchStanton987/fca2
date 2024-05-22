import { isISOString } from "utils/date"

type ScreenParamsType = Record<string, string | boolean | number | Date>

export type SearchParams<T extends ScreenParamsType> = {
  [Property in keyof T]: string
}

// Workaround for a regression in expo-router 3 : can't pass parenthesis in query params
const openBracket = "--OPEN_BRACKET--"
const closeBracket = "--CLOSE_BRACKET--"
const encodeRoutePath = (path: string) =>
  path.replaceAll("(", openBracket).replaceAll(")", closeBracket)
const decodeRoutePath = (path: string) =>
  path.replaceAll(openBracket, "(").replaceAll(closeBracket, ")")

export const parseStr = (initVal: string) => {
  // JSON stringified boolean
  if (initVal === "true") return true
  if (initVal === "false") return false
  // JSON stringified Date
  if (isISOString(initVal)) return new Date(initVal)
  // JSON stringified number
  const num = parseInt(initVal, 10)
  if (!Number.isNaN(num)) return num
  // parse string to avoid using "(" and ")" in query params
  return decodeRoutePath(initVal)
}

export const toLocalParams = <T extends ScreenParamsType>(params: T): SearchParams<T> => {
  const localParams = {} as SearchParams<T>
  Object.keys(params).forEach(key => {
    const val = params[key as keyof T]
    if (val instanceof Date) {
      localParams[key as keyof T] = val.toJSON()
      return
    }
    if (typeof val === "string") {
      localParams[key as keyof T] = encodeRoutePath(val)
      return
    }
    if (val !== undefined) {
      localParams[key as keyof T] = encodeRoutePath(JSON.stringify(val))
    }
  })
  return localParams as SearchParams<T>
}

export const fromLocalParams = <T extends ScreenParamsType>(params: SearchParams<T>): T => {
  const localParams = {} as T
  Object.keys(params).forEach(key => {
    const val = parseStr(params[key as keyof T])
    localParams[key as keyof T] = val as T[keyof T]
  })
  return localParams
}
