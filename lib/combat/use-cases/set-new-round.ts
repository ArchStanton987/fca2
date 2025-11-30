import { getSecAttr } from "lib/character/abilities/abilities-provider"
import { getCombatStatus } from "lib/character/combat-status/combat-status-provider"
import Health from "lib/character/health/Health"
import { getHealth } from "lib/character/health/health-provider"
import { UseCasesConfig } from "lib/get-use-case.types"
import repositoryMap from "lib/shared/db/get-repository"

import { defaultAction } from "../Combat"
import { getCombat } from "./sub-combats"

export type SetNewRoundParams = {
  combatId: string
}

export default function setNewRound(config: UseCasesConfig) {
  const { db, store } = config
  const combatStatusRepo = repositoryMap[db].combatStatusRepository
  const combatHistoryRepo = repositoryMap[db].combatHistoryRepository

  return async ({ combatId }: SetNewRoundParams) => {
    const promises = []
    const combat = getCombat(store, combatId)
    const nextRoundId = combat.currRoundId + 1
    const contenders = combat.contendersIds
    Object.keys(contenders).forEach(charId => {
      const health = getHealth(store, charId)
      const secAttr = getSecAttr(store, charId)
      const combatStatus = getCombatStatus(store, charId)
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
        const isUnconscious =
          Health.getHealthEffectId(health.currHp, health.maxHp) === "woundedUnconscious"
        if (isStillInactive || isUnconscious) return
        promises.push(combatStatusRepo.patch({ charId }, { combatStatus: "active" }))
      }
    })
    // create new round
    promises.push(
      combatHistoryRepo.setChild({ id: combat.id, childKey: nextRoundId }, { 1: defaultAction })
    )

    return Promise.all(promises)
  }
}
