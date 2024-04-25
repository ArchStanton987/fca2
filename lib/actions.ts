import dbKeys from "db/db-keys"
import { getRepository } from "lib/RepositoryBuilder"
import squadController from "lib/SquadController"
import Character from "lib/character/Character"
import effectsMap from "lib/character/effects/effects"
import { EffectData } from "lib/character/effects/effects.types"
import { LimbHpId, limbsMap } from "lib/character/health/health"
import { getRandomArbitrary } from "lib/common/utils/dice-calc"

import { groupAddCollectible, groupRemoveCollectible, groupUpdateValue } from "api/api-rtdb"

const getEffectLengthInH = (char: Character, effect: EffectData) => {
  const isJunkie = char.dbAbilities.traits?.includes("chemReliant")
  if (!effect.length) return null
  if (effect.length && effect.isWithdrawal && isJunkie) return effect.length * 0.5
  return effect.length
}

const getEffectLengthInMs = (char: Character, effect: EffectData) => {
  const effectLengthInH = getEffectLengthInH(char, effect)
  return effectLengthInH ? effectLengthInH * 60 * 60 * 1000 : null
}

const getActions = (db: keyof typeof getRepository = "rtdb") => {
  const squadCtrl = squadController(db)
  return {
    updateDate: (newDate: Date, squadId: string, characters: Character[]) => {
      // sets squad new date
      squadCtrl.updateDate(squadId, newDate)

      // update characters data
      characters.forEach(char => {
        // delete expired effects
        const expiredEffects = char.effects.filter(effect => {
          const { startTs, endTs, data } = effect
          const { length } = data
          if (!startTs || !length) return false
          if (endTs && endTs?.getTime() < newDate.getTime()) return true
          const effectLengthInMs = getEffectLengthInMs(char, data)
          if (!effectLengthInMs) return false
          return startTs.getTime() + effectLengthInMs < newDate.getTime()
        })

        groupRemoveCollectible(
          expiredEffects.map(el => dbKeys.char(char.charId).effects.concat(`/${el.dbKey}`))
        )

        // add following effects
        const followingEffects = expiredEffects
          .filter(effect => {
            const { data, startTs, endTs } = effect
            if (!data.nextEffectId || !data.length || !startTs) return false
            const nextEffect = effectsMap[data.nextEffectId]
            const prevEffectLengthInMs = getEffectLengthInMs(char, effect.data)
            const nextEffectLengthInMs = getEffectLengthInMs(char, nextEffect)
            if (!prevEffectLengthInMs || !nextEffectLengthInMs) return false
            const prevEffectEndTs = endTs?.getTime() || startTs.getTime() + prevEffectLengthInMs
            const nextEffectStartTs = prevEffectEndTs
            const nextEffectEndTs = nextEffectStartTs + nextEffectLengthInMs
            if (nextEffectEndTs < newDate.getTime()) return false
            return true
          })
          .map(el => {
            const { data, startTs, endTs } = el
            if (!data.nextEffectId || !data.length || !startTs) return null
            const nextEffect = effectsMap[data.nextEffectId]
            const prevEffectLengthInMs = getEffectLengthInMs(char, data)
            const nextEffectLengthInMs = getEffectLengthInMs(char, nextEffect)
            if (!prevEffectLengthInMs || !nextEffectLengthInMs) return null
            const prevEffectEndTs = endTs?.getTime() || startTs.getTime() + prevEffectLengthInMs
            const nextEffectStartTs = prevEffectEndTs
            const nextEffectEndTs = nextEffectStartTs + nextEffectLengthInMs
            return {
              id: data.nextEffectId,
              startTs: new Date(nextEffectStartTs),
              endTs: new Date(nextEffectEndTs)
            }
          })
          .filter(el => !!el)
        const followingEffectsPayload = followingEffects.map(el => ({
          containerUrl: dbKeys.char(char.charId).effects,
          data: el
        }))

        groupAddCollectible(followingEffectsPayload)

        // heal
        const { healHpPerHour } = char.secAttr.curr
        const hoursPassed = (newDate.getTime() - char.date.getTime()) / 3600000
        const { missingHp } = char.health
        const maxHealedHp = Math.round(healHpPerHour * hoursPassed)
        const healedHp = Math.min(missingHp, maxHealedHp)
        const newLimbsHp = { ...char.health.limbsHp }
        const limbsHpArray = Object.entries(char.health.limbsHp).map(([id, value]) => ({
          id,
          value
        }))
        for (let i = 0; i < healedHp; i += 1) {
          const healableLimbs = limbsHpArray.filter(
            ({ value, id }) => value < limbsMap[id as LimbHpId].maxValue
          )
          const randomIndex = getRandomArbitrary(0, healableLimbs.length)
          const limbIdToHeal = healableLimbs[randomIndex].id
          newLimbsHp[limbIdToHeal as LimbHpId] += 1
        }
        const healthPayload = Object.entries(newLimbsHp).map(([id, value]) => ({
          url: dbKeys.char(char.charId).status.index.concat(`/${id}`),
          data: value
        }))
        groupUpdateValue(healthPayload)
      })
    }
  }
}

export default getActions
