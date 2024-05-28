/* eslint-disable import/prefer-default-export */
import dbKeys from "db/db-keys"
import Character from "lib/character/Character"
import effectsMap from "lib/character/effects/effects"
import { getEffectLengthInMs } from "lib/character/effects/effects-utils"
import { DbEffect, DbEffects, Effect, EffectId } from "lib/character/effects/effects.types"

import {
  addCollectible,
  groupAddCollectible,
  groupRemoveCollectible,
  groupUpdateValue,
  removeCollectible,
  updateValue
} from "api/api-rtdb"

import { getRtdbSub } from "../../common/utils/rtdb-utils"

const getContainerPath = (charId: string) => dbKeys.char(charId).effects
const getElementPath = (charId: string, dbKey: Effect["dbKey"]) =>
  getContainerPath(charId).concat("/", dbKey)

const fbEffectsRepository = {
  get: (charId: string, dbKey: Effect["dbKey"]) => {
    if (dbKey === undefined) throw new Error("Effect has no dbKey")
    const path = getElementPath(charId, dbKey)
    const sub = getRtdbSub<DbEffect>(path)
    return sub
  },

  getAll: (charId: string) => {
    const path = getContainerPath(charId)
    const sub = getRtdbSub<DbEffects>(path)
    return sub
  },

  add: async (charId: string, dbEffect: DbEffect) => {
    const path = getContainerPath(charId)
    return addCollectible(path, dbEffect)
  },

  groupAdd: (charId: string, dbEffects: DbEffect[]) => {
    const containerUrl = getContainerPath(charId)
    const payload = dbEffects.map(dbEffect => ({
      containerUrl,
      data: dbEffect
    }))
    return groupAddCollectible(payload)
  },

  update: async (charId: string, dbKey: Effect["dbKey"], updatedEffect: DbEffect) => {
    const path = getElementPath(charId, dbKey)
    return updateValue(path, updatedEffect)
  },

  groupUpdate: (charId: string, updates: { dbKey: Effect["dbKey"]; updatedEffect: DbEffect }[]) => {
    const payload = updates.map(({ dbKey, updatedEffect }) => ({
      url: getElementPath(charId, dbKey),
      data: updatedEffect
    }))
    return groupUpdateValue(payload)
  },

  remove: async (charId: string, effect: Effect) => {
    const path = getElementPath(charId, effect.dbKey)
    return removeCollectible(path)
  },

  groupRemove: (charId: string, effects: Effect[]) => {
    const urls = effects.map(effect => getElementPath(charId, effect.dbKey))
    return groupRemoveCollectible(urls)
  },

  createDbEffect: (char: Character, effectId: EffectId, startDate?: Date) => {
    const refStartDate = startDate || char.date
    const dbEffect: DbEffect = { id: effectId, startTs: refStartDate.toJSON() }
    const lengthInMs = getEffectLengthInMs(char, effectsMap[effectId])
    if (lengthInMs) {
      dbEffect.endTs = new Date(refStartDate.getTime() + lengthInMs).toJSON()
    }
    return dbEffect
  }
}

export default fbEffectsRepository
