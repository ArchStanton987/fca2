import Playable from "lib/character/Playable"
import repositoryMap from "lib/shared/db/get-repository"

import Combat from "../Combat"

export type EndWaitParams = {
  combat: Combat
  actor: Playable
}

export default function endWait(dbType: keyof typeof repositoryMap = "rtdb") {
  const combatStatusRepo = repositoryMap[dbType].combatStatusRepository
  const combatRepo = repositoryMap[dbType].combatRepository
  const actionRepo = repositoryMap[dbType].actionRepository

  return ({ combat, actor }: EndWaitParams) => {
    const promises = []

    // clear currentActorId (in case another actor is doing combined action)
    if (combat.currActorId) {
      promises.push(combatRepo.setChild({ id: combat.id, childKey: "currActorId" }, ""))
    }

    // set actor new status
    promises.push(
      combatStatusRepo.setChild({ charId: actor.charId, childKey: "combatStatus" }, "active")
    )

    // reset current action
    const combatId = combat.id
    const roundId = combat.currRoundId
    const actionId = combat.currActionId
    promises.push(actionRepo.delete({ combatId, roundId, id: actionId }))

    return Promise.all(promises)
  }
}
