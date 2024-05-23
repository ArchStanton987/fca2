import { getRepository } from "lib/RepositoryBuilder"

import Character from "../Character"
import getEffectsUseCases from "../effects/effects-use-cases"
import { Effect } from "../effects/effects.types"
import { limbsMap, radStates } from "../health/health"
import { getMissingHp } from "../health/health-calc"
import { getHealthState } from "../health/health-utils"
import { DbStatus } from "./status.types"

// TODO: REFACTOR: split and add to effects utils

/* eslint-disable import/prefer-default-export */
export const onStatusUpdate = (
  character: Character,
  newStatus: DbStatus,
  db: keyof typeof getRepository = "rtdb"
) => {
  const effectsUseCases = getEffectsUseCases(db)
  const promises = []

  // handles HP fields
  // handles cripled effects

  Object.values(limbsMap).forEach(({ id, cripledEffect }) => {
    const currValue = character.health.limbsHp[id]
    const newValue = newStatus[id]

    if (newValue !== currValue) {
      const currCripledEffect: Effect | undefined = character?.effectsRecord[cripledEffect]
      // remove cripled effect if the new value is greater than 0
      if (currCripledEffect && newValue > 0) {
        promises.push(effectsUseCases.remove(character.charId, currCripledEffect))
      }
      // add cripled effect if the new value is less than or equal to 0
      if (!currCripledEffect && newValue <= 0) {
        promises.push(effectsUseCases.add(character, cripledEffect))
      }
    }
  })

  // handle health status effects
  const { hp, maxHp } = character.health
  const currHealthState = getHealthState(hp, maxHp)
  const currHealthStateEffect = currHealthState ? character.effectsRecord[currHealthState] : null

  const newMissingHp = getMissingHp(newStatus)
  const newCurrHp = maxHp - newMissingHp
  const newHealthState = getHealthState(newCurrHp, maxHp)

  // add new health state effect if the new health state is different from the current one
  if (newHealthState && newHealthState !== currHealthState) {
    promises.push(effectsUseCases.add(character, newHealthState))
  }
  // remove current health state effect if the new health state is different from the current one
  if (currHealthStateEffect && newHealthState !== currHealthStateEffect.id) {
    promises.push(effectsUseCases.remove(character.charId, currHealthStateEffect))
  }

  // handles rads effects
  const { rads } = character.health
  const newRads = newStatus.rads
  const radsState = radStates.find(el => rads > el.threshold)
  const radsStateEffect = radsState ? character.effectsRecord[radsState.id] : null

  const newRadsState = radStates.find(el => newRads > el.threshold)
  // add new rads state effect if the new rads state is different from the current one
  if (newRadsState && newRadsState.id !== radsStateEffect?.id) {
    promises.push(effectsUseCases.add(character, newRadsState.id))
  }
  // remove current rads state effect if the new rads state is different from the current one
  if (radsStateEffect && newRadsState?.id !== radsStateEffect.id) {
    promises.push(effectsUseCases.remove(character.charId, radsStateEffect))
  }

  return Promise.all(promises)
}
