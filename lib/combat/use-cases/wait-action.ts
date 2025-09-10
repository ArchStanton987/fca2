import repositoryMap from "lib/shared/db/get-repository"

export type WaitActionParams = {
  action: { actorId: string }
}

export default function waitAction(dbType: keyof typeof repositoryMap = "rtdb") {
  const combatStatusRepo = repositoryMap[dbType].combatStatusRepository
  // set actor new status
  return async ({ action }: WaitActionParams) =>
    combatStatusRepo.patch({ charId: action.actorId }, { combatStatus: "wait" })
}
