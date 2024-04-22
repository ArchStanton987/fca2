/* eslint-disable import/prefer-default-export */
import database from "config/firebase-env"
import dbKeys from "db/db-keys"
import { DbEffect, DbEffects, Effect, EffectId } from "lib/character/effects/effects.types"

import {
  addCollectible,
  groupAddCollectible,
  groupRemoveCollectible,
  removeCollectible
} from "api/api-rtdb"

import { getRtdbSub } from "./common/utils/rtdb-utils"

const getContainerPath = (charId: string) => dbKeys.char(charId).effects
const getItemPath = (charId: string, dbKey: string) => getContainerPath(charId).concat("/", dbKey)

const fbEffectsRepository = {
  get: (charId: string, effectId: EffectId) => {
    const path = getItemPath(charId, effectId)
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

  remove: async (charId: string, effect: Effect) => {
    if (effect.dbKey === undefined) throw new Error("Effect has no dbKey")
    const path = getItemPath(charId, effect.dbKey)
    return removeCollectible(path)
  },

  groupRemove: (charId: string, effects: Effect[]) => {
    const urls = effects
      .filter(effect => effect.dbKey !== undefined)
      .map(effect => {
        if (effect.dbKey === undefined) throw new Error("Effect has no dbKey")
        return getItemPath(charId, effect.dbKey)
      })
    return groupRemoveCollectible(urls)
  }
}

export default fbEffectsRepository
