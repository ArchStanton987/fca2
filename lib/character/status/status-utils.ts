import { getRepository } from "lib/RepositoryBuilder"
import {
  handleHealthStatusEffects,
  handleLimbsEffects,
  handleRadsEffects
} from "lib/character/effects/effects-utils"

import Character from "../Character"
import getEffectsUseCases from "../effects/effects-use-cases"
import { DbStatus } from "./status.types"

/* eslint-disable import/prefer-default-export */
export const onStatusUpdate = (
  character: Character,
  newStatus: DbStatus,
  db: keyof typeof getRepository = "rtdb"
) => {
  const effectsUseCases = getEffectsUseCases(db)
  const promises = []

  // handle add / remove cripled limbs effects
  const limbEffectsRequest = handleLimbsEffects(character, newStatus, effectsUseCases)
  promises.push(...limbEffectsRequest)

  // handle add / remove health status effects
  const healthEffects = handleHealthStatusEffects(character, newStatus, effectsUseCases)
  promises.push(...healthEffects)

  // handle add / remove rads effects
  const radsEffects = handleRadsEffects(character, newStatus, effectsUseCases)
  promises.push(...radsEffects)

  return Promise.all(promises)
}
