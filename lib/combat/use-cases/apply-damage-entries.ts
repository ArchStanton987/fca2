import { ThenableReference } from "firebase/database"
import Abilities from "lib/character/abilities/Abilities"
import { CombatStatus } from "lib/character/combat-status/combat-status.types"
import Effect from "lib/character/effects/Effect"
import { EffectId } from "lib/character/effects/effects.types"
import addEffect from "lib/character/effects/use-cases/add-effect"
import Health from "lib/character/health/Health"
import { CreatedElements, defaultCreatedElements } from "lib/objects/created-elements"
import repositoryMap from "lib/shared/db/get-repository"

import { DamageEntries } from "../combats.types"

export type ApplyDamageEntriesParams = {
  roundId: number
  contenders: Record<
    string,
    {
      health: Health
      combatStatus: CombatStatus
      abilities: Abilities
      effects: Record<EffectId, Effect>
    }
  >
  damageEntries: DamageEntries
  currDate: Date
}

export default function applyDamageEntries(
  dbType: keyof typeof repositoryMap = "rtdb",
  createdElements: CreatedElements = defaultCreatedElements
) {
  const statusRepo = repositoryMap[dbType].statusRepository
  const combatStatusRepo = repositoryMap[dbType].combatStatusRepository

  return ({ roundId, contenders, damageEntries, currDate }: ApplyDamageEntriesParams) => {
    const promises: (Promise<void> | ThenableReference)[] = []
    if (damageEntries === false) return null
    // loop through every entry
    Object.values(damageEntries ?? {}).forEach(entry => {
      const { charId, entryType } = entry
      const { health, combatStatus, effects, abilities } = contenders[charId]
      const { traits } = abilities
      if (!health) throw new Error("could not find character")
      switch (entryType) {
        // handle health points update
        case "hp": {
          if (entryType === "hp") {
            const { localization, damage = 0 } = entry
            const { currHp, maxHp } = health
            if (!localization) throw new Error("Missing damage loc")
            // TODO: FIX HP SYSTEM
            const newHp = currHp - damage < 0 ? 0 : currHp - damage
            promises.push(statusRepo.patch({ charId }, { [localization]: newHp }))
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
          promises.push(statusRepo.patch({ charId }, { rads }))
          break
        }
        // handle effects
        case "effect": {
          const { effectId } = entry
          if (!effectId) throw new Error("Missing effect id in damage entry")
          // promises.push(effectsUseCases.add(char, effectId))
          promises.push(
            addEffect(
              dbType,
              createdElements
            )({ effectId, effects, startDate: currDate, charId, traits })
          )
          break
        }
        default:
          throw new Error("Unknown damage entry type")
      }
    })

    return Promise.all(promises)
  }
}
