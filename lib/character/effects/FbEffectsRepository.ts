/* eslint-disable import/prefer-default-export */
import dbKeys from "db/db-keys"
import { DbEffect, DbEffects, Effect } from "lib/character/effects/effects.types"
import { CharType } from "lib/shared/db/api-rtdb"

import {
  addCollectible,
  groupAddCollectible,
  groupRemoveCollectible,
  groupUpdateValue,
  removeCollectible,
  updateValue
} from "api/api-rtdb"

import { getRtdbSub } from "../../common/utils/rtdb-utils"

const getContainerPath = (charType: CharType, charId: string) =>
  dbKeys.char(charType, charId).effects
const getElementPath = (charType: CharType, charId: string, dbKey: Effect["dbKey"]) =>
  getContainerPath(charType, charId).concat("/", dbKey)

const fbEffectsRepository = {
  get: (charType: CharType, charId: string, dbKey: Effect["dbKey"]) => {
    if (dbKey === undefined) throw new Error("Effect has no dbKey")
    const path = getElementPath(charType, charId, dbKey)
    const sub = getRtdbSub<DbEffect>(path)
    return sub
  },

  getAll: (charType: CharType, charId: string) => {
    const path = getContainerPath(charType, charId)
    const sub = getRtdbSub<DbEffects>(path)
    return sub
  },

  add: async (charType: CharType, charId: string, dbEffect: DbEffect) => {
    const path = getContainerPath(charType, charId)
    return addCollectible(path, dbEffect)
  },

  groupAdd: (charType: CharType, charId: string, dbEffects: DbEffect[]) => {
    const containerUrl = getContainerPath(charType, charId)
    const payload = dbEffects.map(dbEffect => ({
      containerUrl,
      data: dbEffect
    }))
    return groupAddCollectible(payload)
  },

  update: async (
    charType: CharType,
    charId: string,
    dbKey: Effect["dbKey"],
    updatedEffect: DbEffect
  ) => {
    const path = getElementPath(charType, charId, dbKey)
    return updateValue(path, updatedEffect)
  },

  groupUpdate: (
    charType: CharType,
    charId: string,
    updates: { dbKey: Effect["dbKey"]; updatedEffect: DbEffect }[]
  ) => {
    const payload = updates.map(({ dbKey, updatedEffect }) => ({
      url: getElementPath(charType, charId, dbKey),
      data: updatedEffect
    }))
    return groupUpdateValue(payload)
  },

  remove: async (charType: CharType, charId: string, effect: Effect) => {
    const path = getElementPath(charType, charId, effect.dbKey)
    return removeCollectible(path)
  },

  groupRemove: (charType: CharType, charId: string, effects: Effect[]) => {
    const urls = effects.map(effect => getElementPath(charType, charId, effect.dbKey))
    return groupRemoveCollectible(urls)
  }
}

export default fbEffectsRepository
