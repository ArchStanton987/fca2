import Playable from "lib/character/Playable"
import { CombatStatus } from "lib/character/combat-status/combat-status.types"
import { getHealthState } from "lib/character/health/health-utils"
import repositoryMap from "lib/shared/db/get-repository"

import Combat, { defaultAction } from "../Combat"
import { getCurrentRoundId } from "../utils/combat-utils"

export type SetNewRoundParams = {
  contenders: Record<string, Playable>
  combatStatuses: Record<string, CombatStatus>
  combat: Combat
}

export default function setNewRound(dbType: keyof typeof repositoryMap = "rtdb") {
  const combatStatusRepo = repositoryMap[dbType].combatStatusRepository

  const roundRepo = repositoryMap[dbType].roundRepository

  return async ({ contenders, combatStatuses, combat }: SetNewRoundParams) => {
    const promises = []
    const nextRoundId = getCurrentRoundId(combat) + 1
    Object.entries(contenders).forEach(([charId, contender]) => {
      const { secAttr, health } = contender
      const combatStatus = combatStatuses[charId]
      // reset AP for all contenders who are not dead
      if (combatStatus.combatStatus !== "dead") {
        const maxAp = secAttr.curr.actionPoints
        promises.push(combatStatusRepo.patch({ charId }, { currAp: maxAp }))
      }
      // remove char inactive status if inactive is over and in not uncounscious
      const isInactive = combatStatus.combatStatus === "inactive"
      if (isInactive) {
        const { inactiveRecord } = combatStatus
        const isStillInactive = Object.values(inactiveRecord).some(
          r => nextRoundId >= r.roundStart && nextRoundId <= r.roundEnd
        )
        const isUnconscious = getHealthState(health.hp, health.maxHp) === "woundedUnconscious"
        if (isStillInactive || isUnconscious) return
        promises.push(combatStatusRepo.patch({ charId }, { combatStatus: "active" }))
      }
    })
    // create new round
    promises.push(roundRepo.set({ combatId: combat.id, id: nextRoundId }, { 1: defaultAction }))

    return Promise.all(promises)
  }
}
