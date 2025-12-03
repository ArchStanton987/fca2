import { getSecAttr } from "lib/character/abilities/abilities-provider"
import { getCombatStatus } from "lib/character/combat-status/combat-status-provider"
import { UseCasesConfig } from "lib/get-use-case.types"
import repositoryMap from "lib/shared/db/get-repository"

import { REACTION_MIN_AP_COST } from "../const/combat-const"
import { getCombat } from "./sub-combats"

export type PickTargetParams = {
  combatId: string
  targetId: string
}

export default function pickTarget({ db, store }: UseCasesConfig) {
  const actionRepo = repositoryMap[db].actionRepository

  return ({ combatId, targetId }: PickTargetParams) => {
    const targetCurrArmorClass = getSecAttr(store, targetId).curr.armorClass
    const roundId = getCombat(store, combatId).currRoundId
    const combatStatus = getCombatStatus(store, targetId)
    const bonusAc = combatStatus.armorClassBonusRecord?.[roundId] ?? 0
    const targetAp = combatStatus.currAp
    const targetCanReact = targetAp >= REACTION_MIN_AP_COST
    const targetArmorClass = targetCurrArmorClass + bonusAc

    const promises = [
      // @ts-ignore
      actionRepo.patch({ combatId }, { targetId, reactionRoll: targetCanReact ? null : false }),
      actionRepo.patchChild({ combatId, childKey: "roll" }, { targetArmorClass })
    ]

    return Promise.all(promises)
  }
}
