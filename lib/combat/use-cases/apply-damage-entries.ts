import { ThenableReference } from "firebase/database"
import { getCombatStatus } from "lib/character/combat-status/combat-status-provider"
import addEffect from "lib/character/effects/use-cases/add-effect"
import Health, { limbsMap } from "lib/character/health/Health"
import { getHealth } from "lib/character/health/health-provider"
import { UseCasesConfig } from "lib/get-use-case.types"
import repositoryMap from "lib/shared/db/get-repository"

import { DamageEntries } from "../combats.types"

export type ApplyDamageEntriesParams = {
  roundId: number
  damageEntries: DamageEntries
}

export default function applyDamageEntries(config: UseCasesConfig) {
  const { db, store } = config
  const healthRepo = repositoryMap[db].healthRepository
  const combatStatusRepo = repositoryMap[db].combatStatusRepository

  return ({ roundId, damageEntries }: ApplyDamageEntriesParams) => {
    const promises: (Promise<void> | ThenableReference)[] = []
    if (damageEntries === false) return null
    // loop through every entry
    Object.values(damageEntries ?? {}).forEach(entry => {
      const { charId, entryType } = entry

      const health = getHealth(store, charId)
      const combatStatus = getCombatStatus(store, charId)

      switch (entryType) {
        // handle health points update
        case "hp": {
          if (entryType === "hp") {
            const { localization, damage = 0 } = entry
            const { currHp, maxHp, limbs } = health
            if (!localization) throw new Error("Missing damage loc")
            const currLimbHp = limbs[localization]
            if (currLimbHp === undefined) throw new Error("Wrong damage loc")
            const newLimbHp = Math.max(0, currLimbHp - damage)
            const minHpToLose = currLimbHp - newLimbHp
            const isVitalLimb = limbsMap[localization].isVital
            const currHpToLose = isVitalLimb ? damage : minHpToLose
            const newHp = currHp - currHpToLose
            promises.push(
              healthRepo.patchChild({ charId, childKey: "limbs" }, { [localization]: newLimbHp }),
              healthRepo.patchChild({ charId, childKey: "currHp" }, newHp)
            )
            const hS = Health.getHealthEffectId(currHp - damage, maxHp)
            if (hS === "vanished" || hS === "dead" || hS === "woundedUnconscious") {
              const newStatus = hS === "woundedUnconscious" ? "inactive" : "dead"
              promises.push(combatStatusRepo.patch({ charId }, { combatStatus: newStatus }))
            }
          }
          break
        }
        // handle inactive combat status update
        case "inactive": {
          const { duration = 0 } = entry
          const roundEnd = roundId + duration
          const prevInactiveRecord = combatStatus?.inactiveRecord
          const inactiveKeys = Object.keys(prevInactiveRecord ?? {}).map(k => Number(k))
          const newKey = inactiveKeys.length !== 0 ? Math.max(...inactiveKeys) + 1 : 0
          const newInactiveEntry = { roundStart: roundId, roundEnd }
          const inactiveRecord = { ...prevInactiveRecord, [newKey]: newInactiveEntry }
          promises.push(
            combatStatusRepo.patch({ charId }, { combatStatus: "inactive", inactiveRecord })
          )
          break
        }
        // handle rads
        case "rads": {
          const { amount = 0 } = entry
          const rads = health.rads + amount
          promises.push(healthRepo.patchChild({ charId, childKey: "rads" }, rads))
          break
        }
        // handle effects
        case "effect": {
          const { effectId } = entry
          if (!effectId) throw new Error("Missing effect id in damage entry")
          promises.push(addEffect(config)({ effectId, charId }))
          break
        }
        default:
          throw new Error("Unknown damage entry type")
      }
    })

    return Promise.all(promises)
  }
}
