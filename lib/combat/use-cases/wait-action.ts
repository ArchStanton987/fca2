import { UseCasesConfig } from "lib/get-use-case.types"
import repositoryMap from "lib/shared/db/get-repository"

export type WaitActionParams = {
  action: { actorId: string }
}

export default function waitAction({ db }: UseCasesConfig) {
  const combatStatusRepo = repositoryMap[db].combatStatusRepository
  // set actor new status
  return async ({ action }: WaitActionParams) =>
    combatStatusRepo.patch({ charId: action.actorId }, { combatStatus: "wait" })
}
