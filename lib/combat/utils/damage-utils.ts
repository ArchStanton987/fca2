/* eslint-disable import/prefer-default-export */
import { DamageEntry } from "../combats.types"

export const reIndexHealthEntries = (entries: Record<number, DamageEntry>) => {
  const newEntries: Record<number, DamageEntry> = {}
  Object.values(entries).forEach((value, i) => {
    newEntries[i + 1] = value
  })
  return newEntries
}
