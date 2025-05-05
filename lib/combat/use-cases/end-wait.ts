import Playable from "lib/character/Playable"
import repositoryMap from "lib/shared/db/get-repository"

import Combat from "../Combat"

export type EndWaitParams = {
  combat: Combat
  actor: Playable
}

export default function endWait(dbType: keyof typeof repositoryMap = "rtdb") {
  const statusRepo = repositoryMap[dbType].statusRepository
  const combatRepo = repositoryMap[dbType].combatRepository

  return ({ combat, actor }: EndWaitParams) => {
    const promises = []

    // clear currentActorId (in case another actor is doing combined action)
    if (combat.currActorId) {
      promises.push(combatRepo.setChild({ id: combat.id, childKey: "currActorId" }, ""))
    }

    // set actor new status
    const charType = actor.meta.isNpc ? "npcs" : "characters"
    promises.push(
      statusRepo.setChild({ charId: actor.charId, charType, childKey: "combatStatus" }, "active")
    )

    return Promise.all(promises)
  }
}
