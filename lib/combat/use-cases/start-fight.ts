import Playable from "lib/character/Playable"
import { UseCasesConfig } from "lib/get-use-case.types"
import repositoryMap from "lib/shared/db/get-repository"

export type StartFightParams = {
  combatId: string
  contenders: Record<string, Playable>
}

export default function startFight({ db }: UseCasesConfig) {
  const combatStatusRepo = repositoryMap[db].combatStatusRepository

  return async ({ combatId, contenders }: StartFightParams) => {
    const promises: Promise<void>[] = []

    Object.entries(contenders).forEach(([charId, playable]) => {
      const currAp = playable.secAttr.curr.actionPoints
      promises.push(
        combatStatusRepo.patch({ charId }, { currAp, combatStatus: "active", combatId })
      )
    })

    return Promise.all(promises)
  }
}
