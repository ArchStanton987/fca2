import Playable from "lib/character/Playable"
import { CombatStatus } from "lib/character/combat-status/combat-status.types"
import getEffectsUseCases from "lib/character/effects/effects-use-cases"
import { getHealthState } from "lib/character/health/health-utils"
import { CreatedElements, defaultCreatedElements } from "lib/objects/created-elements"
import repositoryMap from "lib/shared/db/get-repository"

import Combat from "../Combat"
import { DamageEntries } from "../combats.types"
import { getCurrentRoundId } from "../utils/combat-utils"

export type ApplyDamageEntriesParams = {
  combat: Combat
  contenders: Record<string, Playable>
  combatStatuses: Record<string, CombatStatus>
  damageEntries: DamageEntries
}

export default function applyDamageEntries(
  dbType: keyof typeof repositoryMap = "rtdb",
  createdElements: CreatedElements = defaultCreatedElements
) {
  const statusRepo = repositoryMap[dbType].statusRepository
  const combatStatusRepo = repositoryMap[dbType].combatStatusRepository
  const effectsUseCases = getEffectsUseCases(dbType, createdElements)

  return ({ combat, contenders, combatStatuses, damageEntries }: ApplyDamageEntriesParams) => {
    const promises: Promise<void>[] = []
    if (damageEntries === false) return null
    // loop through every entry
    Object.values(damageEntries ?? {}).forEach(entry => {
      const { charId, entryType } = entry
      const char = contenders[charId]
      const combatStatus = combatStatuses[charId]
      if (!char) throw new Error("could not find character")
      switch (entryType) {
        // handle health points update
        case "hp": {
          if (entryType === "hp") {
            const { localization, damage = 0 } = entry
            const { limbsHp, hp, maxHp } = char.health
            if (!localization) throw new Error("Missing damage loc")
            const currHp = limbsHp[localization]
            // TODO: FIX HP SYSTEM
            const newHp = currHp - damage < 0 ? 0 : currHp - damage
            promises.push(statusRepo.patch({ charId }, { [localization]: newHp }))
            const hS = getHealthState(hp - damage, maxHp)
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
          const roundId = getCurrentRoundId(combat)
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
          const rads = char.health.rads + amount
          promises.push(statusRepo.patch({ charId }, { rads }))
          break
        }
        // handle effects
        case "effect": {
          const { effectId } = entry
          if (!effectId) throw new Error("Missing effect id in damage entry")
          promises.push(effectsUseCases.add(char, effectId))
          break
        }
        default:
          throw new Error("Unknown damage entry type")
      }
    })

    return Promise.all(promises)
  }
}
