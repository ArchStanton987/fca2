import repositoryMap from "lib/shared/db/get-repository"

import CombatState from "../CombatState"

export type EndWaitParams = {
  combatId: string
  combatState: CombatState
  charId: string
}

export default function endWait(dbType: keyof typeof repositoryMap = "rtdb") {
  const combatStatusRepo = repositoryMap[dbType].combatStatusRepository
  const combatStateRepo = repositoryMap[dbType].combatStateRepository

  return ({ combatId, combatState, charId }: EndWaitParams) => {
    const promises = []

    // clear currentActorId (in case another actor is doing combined action)
    if (combatState?.actorIdOverride) {
      promises.push(combatStateRepo.delete({ id: combatId, childKey: "actorIdOverride" }))
    }

    // set actor new status
    promises.push(combatStatusRepo.setChild({ charId, childKey: "combatStatus" }, "active"))

    // reset current action
    promises.push(combatStateRepo.delete({ id: combatId, childKey: "action" }))

    return Promise.all(promises)
  }
}
