import { getKnowledges, getSecAttr, getSkills } from "lib/character/abilities/abilities-provider"
import knowledgeLevels from "lib/character/abilities/knowledges/knowledges-levels"
import { SkillId } from "lib/character/abilities/skills/skills.types"
import { getCombatStatus } from "lib/character/combat-status/combat-status-provider"
import { getCharInfo } from "lib/character/info/info-provider"
import { withDodgeSpecies } from "lib/character/playable.const"
import { UseCasesConfig } from "lib/get-use-case.types"
import { getCombatWeapons } from "lib/inventory/use-sub-inv-cat"
import Weapon from "lib/objects/data/weapons/Weapon"
import { reactionsRecord } from "lib/reaction/reactions.const"
import repositoryMap from "lib/shared/db/get-repository"

import { getParrySkill } from "../utils/combat-utils"
import { getCombat, getCombatState } from "./sub-combats"

export type SaveReactionParams = {
  combatId: string
  payload:
    | { reactionType: "none" }
    | { reactionType: "dodge"; dice: number }
    | { reactionType: "parry"; dice: number }
}

export default function saveReaction({ db, store }: UseCasesConfig) {
  const actionRepo = repositoryMap[db].actionRepository
  const combatStatusRepo = repositoryMap[db].combatStatusRepository

  return ({ combatId, payload }: SaveReactionParams) => {
    const promises = []

    switch (payload.reactionType) {
      case "none": {
        promises.push(actionRepo.patchChild({ combatId, childKey: "reactionRoll" }, false))
        break
      }
      case "dodge":
      case "parry": {
        const { action } = getCombatState(store, combatId)

        // check if is playable
        const { targetId } = action
        const targetIsInvalid = !targetId || targetId === "other"
        if (targetIsInvalid)
          throw new Error(`Target with id : ${action.targetId} is not a playable`)

        // check if can use reaction
        const { speciesId } = getCharInfo(store, targetId)
        const canDodge = withDodgeSpecies.includes(speciesId)
        if (!canDodge) throw new Error(`Target of species : ${speciesId} can't dodge`)

        // check if is combat active
        const cs = getCombatStatus(store, targetId)
        const { combatStatus, currAp, armorClassBonusRecord, actionBonus } = cs
        const isActive = combatStatus === "active" || combatStatus === "wait"
        if (!isActive) throw new Error("Target is combat inactive and can't dodge")

        // check if has AP
        const { apCost } = reactionsRecord[payload.reactionType]
        const hasEnoughAp = apCost <= currAp
        if (!hasEnoughAp) throw new Error("Target has not enough AP")

        // calc AC
        const { currRoundId } = getCombat(store, combatId)
        const { armorClass } = getSecAttr(store, targetId).curr
        const armorClassBonus = armorClassBonusRecord?.[currRoundId] ?? 0

        // calc scores
        const skills = getSkills(store, targetId).curr
        const knowledges = getKnowledges(store, targetId)
        let knowledgeBonus = 0
        let skillId: SkillId = "physical"
        if (payload.reactionType === "dodge") {
          knowledgeBonus = knowledgeLevels.find(el => el.id === knowledges.kDodge)?.bonus ?? 0
        }
        if (payload.reactionType === "parry") {
          knowledgeBonus = knowledgeLevels.find(el => el.id === knowledges.kParry)?.bonus ?? 0
          const combatWeapon = getCombatWeapons(store, targetId)
          const weapon = combatWeapon.length > 0 ? combatWeapon[0] : Weapon.getUnarmed()
          skillId = getParrySkill(weapon.data.skillId)
        }

        const reactionPayload = {
          opponentId: targetId,
          opponentApCost: apCost,
          opponentDice: payload.dice,
          opponentSumAbilities: skills[skillId] + actionBonus + knowledgeBonus,
          opponentArmorClass: armorClass + armorClassBonus
        }

        promises.push(
          actionRepo.setChild({ combatId, childKey: "reactionRoll" }, reactionPayload),
          combatStatusRepo.patchChild({ charId: targetId, childKey: "currAp" }, currAp - apCost)
        )
        break
      }
      default:
        throw new Error(`setReaction : Unknown reaction type`)
    }

    return Promise.all(promises)
  }
}
