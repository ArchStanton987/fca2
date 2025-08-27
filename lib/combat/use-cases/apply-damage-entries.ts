import Playable from "lib/character/Playable"
import getEffectsUseCases from "lib/character/effects/effects-use-cases"
import { getHealthState } from "lib/character/health/health-utils"
import { CreatedElements, defaultCreatedElements } from "lib/objects/created-elements"
import repositoryMap from "lib/shared/db/get-repository"

import Combat from "../Combat"
import { DamageEntries, PlayerCombatData } from "../combats.types"
import { getCurrentRoundId } from "../utils/combat-utils"
import updateContender from "./update-contender"

export type ApplyDamageEntriesParams = {
  combat: Combat
  contenders: Record<string, { char: Playable; combatData: PlayerCombatData }>
  damageEntries: DamageEntries
}

export default function applyDamageEntries(
  dbType: keyof typeof repositoryMap = "rtdb",
  createdElements: CreatedElements = defaultCreatedElements
) {
  const statusRepo = repositoryMap[dbType].statusRepository
  const effectsUseCases = getEffectsUseCases(dbType, createdElements)

  return ({ combat, contenders, damageEntries }: ApplyDamageEntriesParams) => {
    const promises: Promise<void>[] = []
    if (damageEntries === false) return null
    // loop through every entry
    Object.values(damageEntries ?? {}).forEach(entry => {
      const { charId, entryType } = entry
      const { char, combatData } = contenders[charId]
      if (!char) throw new Error("could not find character")

      const { meta, health } = char
      const charType = meta.isNpc ? "npcs" : "characters"
      switch (entryType) {
        // handle health points update
        case "hp": {
          if (entryType === "hp") {
            const { localization, damage = 0 } = entry
            if (!localization) throw new Error("Missing damage loc")
            const currHp = char.status[localization]
            // TODO: FIX HP SYSTEM
            const newHp = currHp - damage < 0 ? 0 : currHp - damage
            promises.push(statusRepo.patch({ charId, charType }, { [localization]: newHp }))
            const hS = getHealthState(health.hp - damage, health.maxHp)
            if (hS === "vanished" || hS === "dead" || hS === "woundedUnconscious") {
              const newStatus = hS === "woundedUnconscious" ? "inactive" : "dead"
              promises.push(statusRepo.patch({ charId, charType }, { combatStatus: newStatus }))
            }
          }
          break
        }
        // handle inactive combat status update
        case "inactive": {
          const { duration = 0 } = entry
          const roundId = getCurrentRoundId(combat)
          const inactiveRoundEnd = roundId + duration
          const prevInactiveRecord = combatData?.inactiveRecord
          const inactiveKeys = Object.keys(prevInactiveRecord ?? {}).map(k => Number(k))
          const newKey = inactiveKeys.length !== 0 ? Math.max(...inactiveKeys) + 1 : 0
          const newInactiveEntry = { inactiveRoundStart: roundId, inactiveRoundEnd }
          const inactiveRecord = { ...prevInactiveRecord, [newKey]: newInactiveEntry }
          promises.push(statusRepo.patch({ charId, charType }, { combatStatus: "inactive" }))
          promises.push(updateContender(dbType)({ char, combat, payload: { inactiveRecord } }))
          break
        }
        // handle rads
        case "rads": {
          const { amount = 0 } = entry
          const rads = char.status.rads + amount
          promises.push(statusRepo.patch({ charId, charType }, { rads }))
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
