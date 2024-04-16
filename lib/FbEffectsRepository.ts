/* eslint-disable import/prefer-default-export */
import database from "config/firebase"
import dbKeys from "db/db-keys"
import { DataSnapshot, onValue, ref } from "firebase/database"
import { CollectibleRepository } from "lib/Repository"
import { DbEffect, Effect, EffectId } from "lib/character/effects/effects.types"

import {
  addCollectible,
  groupAddCollectible,
  groupRemoveCollectible,
  removeCollectible
} from "api/api-rtdb"

export default function fbEffectsRepository(): CollectibleRepository {
  return {
    get: (charId: string, effectId: EffectId) => {
      const path = dbKeys.char(charId).effects.concat("/", effectId)
      const dbRef = ref(database, path)
      let effect
      const unsubscribe = onValue(dbRef, snapshot => {
        effect = snapshot.val()
      })
      return { effect, unsubscribe }
    },

    getAll: (charId: string) => {
      const path = dbKeys.char(charId).effects
      const dbRef = ref(database, path)
      let effects
      const unsubscribe = onValue(dbRef, (snapshot: DataSnapshot) => {
        effects = snapshot.val()
      })
      return { effects, unsubscribe }
    },

    add: async (charId: string, dbEffect: DbEffect) =>
      addCollectible(dbKeys.char(charId).effects, dbEffect),

    groupAdd: (charId: string, dbEffects: DbEffect[]) => {
      const containerUrl = dbKeys.char(charId).effects
      const payload = dbEffects.map(dbEffect => ({
        containerUrl,
        data: dbEffect
      }))
      return groupAddCollectible(payload)
    },

    remove: async (charId: string, effect: Effect) => {
      if (effect.dbKey === undefined) throw new Error("Effect has no dbKey")
      const path = dbKeys.char(charId).effects.concat("/", effect.dbKey)
      return removeCollectible(path)
    },

    groupRemove: (charId: string, effects: Effect[]) => {
      const urls = effects
        .filter(effect => effect.dbKey !== undefined)
        .map(effect => {
          if (effect.dbKey === undefined) throw new Error("Effect has no dbKey")
          return dbKeys.char(charId).effects.concat("/", effect.dbKey)
        })
      return groupRemoveCollectible(urls)
    }
  }
}
