import repositoryMap from "lib/shared/db/get-repository"

import Combat from "../Combat"
import { DbAction } from "../combats.types"
import { getActionId, getCurrentRoundId } from "../utils/combat-utils"

export type SetActionParams<K extends keyof DbAction> = {
  payload: DbAction | { childKey: K; data: DbAction[K] }
  combat: Combat
}

export default function setAction(dbType: keyof typeof repositoryMap = "rtdb") {
  const actionRepo = repositoryMap[dbType].actionRepository

  return <K extends keyof DbAction>({ combat, payload }: SetActionParams<K>) => {
    const combatId = combat.id
    const roundId = getCurrentRoundId(combat)
    const id = getActionId(combat)

    if ("childKey" in payload) {
      const { childKey, data } = payload
      return actionRepo.setChild({ combatId, roundId, id, childKey }, data)
    }

    return actionRepo.set({ combatId, roundId, id }, payload)
  }
}
