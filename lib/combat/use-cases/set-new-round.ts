import repositoryMap from "lib/shared/db/get-repository"

import Combat, { defaultAction } from "../Combat"
import { PlayerData } from "../combats.types"
import { getCurrentRoundId } from "../utils/combat-utils"

export type SetNewRoundParams = {
  contenders: Record<string, PlayerData>
  combat: Combat
}

export default function setNewRound(dbType: keyof typeof repositoryMap = "rtdb") {
  // const combatRepo = repositoryMap[dbType].combatRepository
  const statusRepo = repositoryMap[dbType].statusRepository
  const roundRepo = repositoryMap[dbType].roundRepository

  return ({ contenders, combat }: SetNewRoundParams) => {
    const promises = []
    const nextRoundId = getCurrentRoundId(combat) + 1
    Object.entries(contenders).forEach(([charId, contender]) => {
      const charType = contender.char.meta.isNpc ? "npcs" : "characters"
      // reset AP for all contenders who are not dead
      if (contender.char.status.combatStatus !== "dead") {
        const currAp = contender.char.secAttr.curr.actionPoints
        promises.push(statusRepo.patch({ charId, charType }, { currAp }))
      }
      // remove char inactive status if inactive is over
      const isInactive = contender.char.status.combatStatus === "inactive"
      if (isInactive) {
        const type = contender.char.meta.isNpc ? "npcs" : "players"
        const { inactiveRecord = {} } = combat[type][charId]
        const staysInactive = Object.values(inactiveRecord).some(
          r => nextRoundId >= r.inactiveRoundStart && nextRoundId <= r.inactiveRoundEnd
        )
        if (staysInactive) return
        promises.push(statusRepo.patch({ charId, charType }, { combatStatus: "active" }))
      }
    })
    // create new round
    promises.push(roundRepo.add({ combatId: combat.id, id: nextRoundId }, { 1: defaultAction }))

    return Promise.all(promises)
  }
}
