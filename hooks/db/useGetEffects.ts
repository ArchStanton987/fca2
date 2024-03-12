import { EffectId } from "lib/character/effects/effects.types"

import dbKeys from "../../db/db-keys"
import useDbSubscribe from "./useDbSubscribe"

export type DbEffect = {
  id: EffectId
  startTs: number
  endTs?: number
}

export type DbEffects = Record<string, DbEffect>

export type CharEffect = {
  id: EffectId
  dbKey: string
  startTs: number
  endTs?: number
}

const handler = (snap?: DbEffects): CharEffect[] => {
  if (!snap) return []
  return Object.entries(snap).map(([key, effect]) => ({
    dbKey: key,
    id: effect.id,
    startTs: effect.startTs,
    endTs: effect.endTs
  }))
}

export default function useGetEffects(charId: string) {
  const dbPath = dbKeys.char(charId).effects

  return useDbSubscribe<DbEffects, CharEffect[]>(dbPath, handler)
}
