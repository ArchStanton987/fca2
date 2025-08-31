export type Form<T> = {
  [K in keyof T]: T[K] extends string ? T[K] | "" : T[K]
}
