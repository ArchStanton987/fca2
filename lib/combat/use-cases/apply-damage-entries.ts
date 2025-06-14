import Playable from "lib/character/Playable"
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

export default function applyDamageEntries(dbType: keyof typeof repositoryMap = "rtdb") {
  const statusRepo = repositoryMap[dbType].statusRepository

  return ({ combat, contenders, damageEntries }: ApplyDamageEntriesParams) => {
    const promises: Promise<void>[] = []
    // loop through every entry
    Object.values(damageEntries).forEach(entry => {
      const { charId, entryType } = entry
      const { char, combatData } = contenders[charId]
      if (!char) throw new Error("could not find character")
      // handle health points update
      if (entryType === "hp") {
        const { localization, damage } = entry
        const currHp = char.status[localization]
        const newHp = currHp - damage < 0 ? 0 : currHp - damage
        const { meta } = char
        const charType = meta.isNpc ? "npcs" : "characters"
        promises.push(statusRepo.patch({ charId, charType }, { [localization]: newHp }))
        return
      }
      // handle inactive combat status update
      const { duration } = entry
      const roundId = getCurrentRoundId(combat)
      const inactiveRoundEnd = roundId + duration
      const prevInactiveRecord = combatData?.inactiveRecord
      const inactiveKeys = Object.keys(prevInactiveRecord ?? {}).map(k => Number(k))
      const newKey = inactiveKeys.length === 0 ? Math.max(...inactiveKeys) + 1 : 0
      const newInactiveEntry = { inactiveRoundStart: roundId, inactiveRoundEnd }
      const inactiveRecord = { ...prevInactiveRecord, [newKey]: newInactiveEntry }
      const charType = char.meta.isNpc ? "npcs" : "characters"
      promises.push(statusRepo.patch({ charId, charType }, { combatStatus: "inactive" }))
      promises.push(updateContender(dbType)({ char, combat, payload: { inactiveRecord } }))
    })

    return Promise.all(promises)
  }
}
