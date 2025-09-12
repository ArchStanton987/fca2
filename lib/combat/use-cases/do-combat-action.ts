import Playable from "lib/character/Playable"
import { CombatStatus } from "lib/character/combat-status/combat-status.types"
import { CreatedElements, defaultCreatedElements } from "lib/objects/created-elements"
import { Clothing } from "lib/objects/data/clothings/clothings.types"
import { Consumable } from "lib/objects/data/consumables/consumables.types"
import { MiscObject } from "lib/objects/data/misc-objects/misc-objects-types"
import weaponsMap from "lib/objects/data/weapons/weapons"
import { Weapon } from "lib/objects/data/weapons/weapons.types"
import repositoryMap from "lib/shared/db/get-repository"

import Combat from "../Combat"
import { DbAction } from "../combats.types"
import { getActivePlayersWithAp, getIsActionEndingRound } from "../utils/combat-utils"
import applyDamageEntries from "./apply-damage-entries"
import itemAction from "./item-action"
import prepareAction from "./prepare-action"
import saveAction from "./save-action"
import setNewRound from "./set-new-round"
import waitAction from "./wait-action"
import weaponAction from "./weapon-action"

export type CombatActionParams = {
  action: DbAction & { actorId: string }
  combat: Combat
  contenders: Record<string, Playable>
  combatStatuses: Record<string, CombatStatus>
  item?: Clothing | Consumable | MiscObject | Weapon
}

export default function doCombatAction(
  dbType: keyof typeof repositoryMap = "rtdb",
  newElements: CreatedElements = defaultCreatedElements
) {
  const combatStatusRepo = repositoryMap[dbType].combatStatusRepository

  return async ({ action, combat, contenders, combatStatuses, item }: CombatActionParams) => {
    const { apCost = 0, actorId, actionType, actionSubtype } = action
    const char = contenders[actorId]
    const combatStatus = combatStatuses[actorId]
    const { charId, meta } = char

    const roundId = combat?.currRoundId

    if (apCost > combatStatus.currAp) throw new Error("Not enough AP to perform this action")

    const isEndingRound = getIsActionEndingRound(combatStatuses, { apCost, ...action })

    const promises = []

    // dispatch action
    switch (actionType) {
      case "weapon": {
        // handle case with species which can't carry weapon
        if (meta.speciesId === "robot" || meta.speciesId === "animal") break
        if (!item) throw new Error("Item is required for weapon action")
        if (!(item?.data?.id in weaponsMap)) throw new Error("item is not a weapon")
        // @ts-ignore
        promises.push(weaponAction(dbType)({ action, contenders, item }))
        break
      }
      case "other":
      case "movement":
        // no further operations needed (handled in saveAction)
        break

      case "wait": {
        if (isEndingRound) throw new Error("End of the round: invalid action")
        const activePlayersWithAp = getActivePlayersWithAp(combatStatuses)
        if (activePlayersWithAp.length <= 1) throw new Error("No other players with AP")
        promises.push(waitAction(dbType)({ action }))
        break
      }

      case "prepare":
        promises.push(prepareAction(dbType)({ action, combatStatuses, roundId }))
        break

      case "item":
        if (actionSubtype !== "pickUp") {
          if (!item) throw new Error("Item is required for item action")
        }
        promises.push(itemAction(dbType, newElements)({ action, contenders, combat, item }))
        break

      default:
        throw new Error(`Unknown action type: ${actionType}`)
    }

    // apply damage entries
    if (action?.healthChangeEntries) {
      const damageEntries = action.healthChangeEntries

      promises.push(
        applyDamageEntries(dbType)({ roundId, contenders, combatStatuses, damageEntries })
      )
    }

    // save action in combat
    promises.push(saveAction(dbType)({ action, combat, contenders: combatStatuses }))

    // handle char status reset & new round creation
    if (isEndingRound) {
      promises.push(setNewRound(dbType)({ contenders, combatStatuses, combat }))
    } else {
      // set actor action points
      const newAp = combatStatus.currAp - apCost
      promises.push(combatStatusRepo.patch({ charId }, { currAp: newAp }))

      // set opponent action points if has reaction roll
      if (action?.reactionRoll) {
        const { opponentId, opponentApCost } = action.reactionRoll
        const oppNewAp = contenders[opponentId].secAttr.curr.actionPoints - opponentApCost
        await combatStatusRepo.patch({ charId: opponentId }, { currAp: oppNewAp })
      }
    }

    return Promise.all(promises)
  }
}
