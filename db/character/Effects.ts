import { EffectId } from "models/effects/EffectId"

type Effect = {
  id: EffectId
  startTs: number
}

export type Effects = Record<string, Effect>
