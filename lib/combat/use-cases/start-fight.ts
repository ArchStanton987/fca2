import { getSecAttr } from "lib/character/abilities/abilities-provider"
import { UseCasesConfig } from "lib/get-use-case.types"
import repositoryMap from "lib/shared/db/get-repository"

import { getContenders } from "./sub-combat"

export type StartFightParams = {
  combatId: string
}

export default function startFight({ db, store }: UseCasesConfig) {
  const combatStatusRepo = repositoryMap[db].combatStatusRepository

  return async ({ combatId }: StartFightParams) => {
    const promises: Promise<void>[] = []

    const contenders = getContenders(store, combatId)

    Object.keys(contenders).forEach(charId => {
      const secAttr = getSecAttr(store, charId)
      const currAp = secAttr.curr.actionPoints
      promises.push(
        combatStatusRepo.patch({ charId }, { currAp, combatStatus: "active", combatId })
      )
    })

    return Promise.all(promises)
  }
}
