export type ScreenParamsType = Record<string, string | boolean | number>

export type SearchParams<T> = {
  [Property in keyof T]: string
}

// TODO: get version from sav
export default abstract class ScreenParams {
  static strToBool = (str: string | string[] | undefined): boolean => str === "true"

  static strToNumber = (str: string | string[] | undefined): number =>
    typeof str === "string" ? parseInt(str, 10) : 0

  static getStr = (str: string | string[] | undefined): string =>
    typeof str === "string" ? str : ""

  static parseStr = (init: string): string | boolean | number => {
    if (init === "true") return true
    if (init === "false") return false
    if (typeof init === "string") {
      const num = parseInt(init, 10)
      if (!Number.isNaN(num)) return num
    }
    return init
  }

  static toLocalParams<T extends ScreenParamsType>(obj: T): SearchParams<T> {
    const localParams = {} as SearchParams<T>
    Object.keys(obj).forEach(key => {
      const val = obj[key as keyof T]
      localParams[key as keyof T] = val?.toString() || ""
    })
    return localParams
  }

  static fromLocalParams<T>(localParams: SearchParams<T>): T {
    const obj = {} as T
    Object.keys(localParams).forEach(key => {
      const val = localParams[key as keyof T]
      obj[key as keyof T] = ScreenParams.parseStr(val) as T[keyof T]
    })
    return obj
  }
}
