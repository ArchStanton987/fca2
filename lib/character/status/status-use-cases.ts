import { getRepository } from "lib/RepositoryBuilder"
import Character from "lib/character/Character"
import getEffectsUseCases from "lib/character/effects/effects-use-cases"
import { Effect } from "lib/character/effects/effects.types"
import { limbsMap, radStates } from "lib/character/health/health"
import { getMissingHp } from "lib/character/health/health-calc"

import { HealthUpdateState } from "../health/health-reducer"
import { DbLimbsHp } from "../health/health-types"
import { getHealthState } from "../health/health-utils"
import { DbStatus } from "./status.types"

const onStatusUpdate = (
  character: Character,
  field: keyof DbStatus,
  newValue: DbStatus[keyof DbStatus],
  db: keyof typeof getRepository = "rtdb"
) => {
  const promises = []
  const limbData = limbsMap[field as keyof DbLimbsHp]

  // handles HP fields
  if (limbData) {
    // handles cripled effects
    const effectsUseCases = getEffectsUseCases(db)
    const cripledEffect: Effect | undefined = character?.effectsRecord[limbData.cripledEffect]
    // remove cripled effect if the new value is greater than 0
    if (cripledEffect && newValue > 0) {
      promises.push(effectsUseCases.remove(character.charId, cripledEffect))
    }
    // add cripled effect if the new value is less than or equal to 0
    if (!cripledEffect && newValue <= 0) {
      promises.push(effectsUseCases.add(character, limbData.cripledEffect))
    }

    // handle health status effects
    const { hp, maxHp } = character.health
    const currHealthState = getHealthState(hp, maxHp)
    const currHealthStateEffect = currHealthState ? character.effectsRecord[currHealthState] : null

    const newStatus = { ...character.status, [field]: newValue }
    const newMissingHp = getMissingHp(newStatus)
    const newCurrHp = maxHp - newMissingHp
    const newHealthState = getHealthState(newCurrHp, maxHp)

    // add new health state effect if the new health state is different from the current one
    if (newHealthState && newHealthState !== currHealthStateEffect?.id) {
      promises.push(effectsUseCases.add(character, newHealthState))
    }
    // remove current health state effect if the new health state is different from the current one
    if (currHealthStateEffect && newHealthState !== currHealthStateEffect.id) {
      promises.push(effectsUseCases.remove(character.charId, currHealthStateEffect))
    }
  }

  // handles rads effects
  if (field === "rads") {
    const effectsUseCases = getEffectsUseCases(db)
    const { rads } = character.health
    const radsState = radStates.find(el => rads > el.threshold)
    const radsStateEffect = radsState ? character.effectsRecord[radsState.id] : null

    const newRadsState = radStates.find(el => newValue > el.threshold)
    // add new rads state effect if the new rads state is different from the current one
    if (newRadsState && newRadsState.id !== radsStateEffect?.id) {
      promises.push(effectsUseCases.add(character, newRadsState.id))
    }
    // remove current rads state effect if the new rads state is different from the current one
    if (radsStateEffect && newRadsState?.id !== radsStateEffect.id) {
      promises.push(effectsUseCases.remove(character.charId, radsStateEffect))
    }
  }

  return Promise.all(promises)
}

function getStatusUseCases(db: keyof typeof getRepository = "rtdb") {
  const repository = getRepository[db].status
  return {
    getElement: (charId: string, field: keyof DbStatus) => repository.get(charId, field),

    get: (charId: string) => repository.getAll(charId),

    updateElement: <T extends keyof DbStatus>(
      character: Character,
      field: T,
      data: DbStatus[T]
    ) => {
      onStatusUpdate(character, field, data, db)
      return repository.updateElement(character.charId, field, data)
    },
    groupUpdate: (character: Character, data: Partial<DbStatus>) => {
      const updates = {} as Partial<DbStatus>
      Object.entries(data).forEach(([key, value]) => {
        updates[key as keyof DbStatus] = value
        onStatusUpdate(character, key as keyof DbStatus, value, db)
      })
      return repository.groupUpdate(character.charId, updates)
    },

    groupMod: (character: Character, updateHealthState: HealthUpdateState) => {
      const updates: Partial<DbStatus> = {}
      Object.entries(updateHealthState).forEach(([key, value]) => {
        if (typeof value.count === "number" && typeof value.initValue === "number") {
          updates[key as keyof DbLimbsHp] = value.initValue + value.count
        }
      })
      Object.entries(updates).forEach(([key, value]) => {
        onStatusUpdate(character, key as keyof DbStatus, value, db)
      })
      return repository.groupUpdate(character.charId, updates)
    },

    updateAll: (charId: string, data: DbStatus) => repository.updateAll(charId, data)
  }
}

export default getStatusUseCases
