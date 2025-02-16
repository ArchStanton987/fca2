import rtdb from "./api-rtdb"

export type RtdbReturnTypes = {
  [K in keyof typeof rtdb]: ReturnType<(typeof rtdb)[K]>
}[keyof typeof rtdb]
