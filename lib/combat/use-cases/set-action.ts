import repositoryMap from "lib/shared/db/get-repository"

import Combat from "../Combat"
import { Action } from "../combats.types"
import { getActionId, getCurrentRoundId } from "../utils/combat-utils"

export type SetActionParams<K extends keyof Action> = {
  payload: Action | { childKey: K; data: Action[K] }
  combat: Combat
}

export default function setAction(dbType: keyof typeof repositoryMap = "rtdb") {
  const actionRepo = repositoryMap[dbType].actionRepository

  return <K extends keyof Action>({ combat, payload }: SetActionParams<K>) => {
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
