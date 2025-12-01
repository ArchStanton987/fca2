import { getSecAttr } from "lib/character/abilities/abilities-provider"
import { UseCasesConfig } from "lib/get-use-case.types"
import repositoryMap from "lib/shared/db/get-repository"

export type StartFightParams = {
  combatId: string
  contenders: string[]
}

export default function startFight({ db, store }: UseCasesConfig) {
  const combatStatusRepo = repositoryMap[db].combatStatusRepository

  return async ({ combatId, contenders }: StartFightParams) => {
    const promises: Promise<void>[] = []

    Object.values(contenders).forEach(charId => {
      const secAttr = getSecAttr(store, charId)
      const currAp = secAttr.curr.actionPoints
      promises.push(
        combatStatusRepo.patch({ charId }, { currAp, combatStatus: "active", combatId })
      )
    })

    return Promise.all(promises)
  }
}
