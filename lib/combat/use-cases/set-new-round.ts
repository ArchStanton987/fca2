import Playable from "lib/character/Playable"
import { getHealthState } from "lib/character/health/health-utils"
import repositoryMap from "lib/shared/db/get-repository"

import Combat, { defaultAction } from "../Combat"
import { PlayerCombatData } from "../combats.types"
import { getCurrentRoundId } from "../utils/combat-utils"

export type SetNewRoundParams = {
  contenders: Record<string, { char: Playable; combatData: PlayerCombatData }>
  combat: Combat
}

export default function setNewRound(dbType: keyof typeof repositoryMap = "rtdb") {
  const statusRepo = repositoryMap[dbType].statusRepository
  const roundRepo = repositoryMap[dbType].roundRepository

  return async ({ contenders, combat }: SetNewRoundParams) => {
    const promises = []
    const nextRoundId = getCurrentRoundId(combat) + 1
    Object.entries(contenders).forEach(([charId, { char }]) => {
      const { meta, status, secAttr, health } = char
      const charType = meta.isNpc ? "npcs" : "characters"
      // reset AP for all contenders who are not dead
      if (status.combatStatus !== "dead") {
        const currAp = secAttr.curr.actionPoints
        promises.push(statusRepo.patch({ charId, charType }, { currAp }))
      }
      // remove char inactive status if inactive is over and in not uncounscious
      const isInactive = status.combatStatus === "inactive"
      if (isInactive) {
        const type = meta.isNpc ? "npcs" : "players"
        const { inactiveRecord = {} } = combat[type][charId]
        const isStillInactive = Object.values(inactiveRecord).some(
          r => nextRoundId >= r.inactiveRoundStart && nextRoundId <= r.inactiveRoundEnd
        )
        const isUnconscious = getHealthState(health.hp, health.maxHp) === "woundedExhausted"
        if (!isStillInactive && !isUnconscious) return
        promises.push(statusRepo.patch({ charId, charType }, { combatStatus: "active" }))
      }
    })
    // create new round
    promises.push(roundRepo.set({ combatId: combat.id, id: nextRoundId }, { 1: defaultAction }))

    return Promise.all(promises)
  }
}
