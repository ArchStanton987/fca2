import Playable from "lib/character/Playable"
import { Clothing } from "lib/objects/data/clothings/clothings.types"
import { Consumable } from "lib/objects/data/consumables/consumables.types"
import { MiscObject } from "lib/objects/data/misc-objects/misc-objects-types"
import { Weapon } from "lib/objects/data/weapons/weapons.types"
import repositoryMap from "lib/shared/db/get-repository"

import Combat from "../Combat"
import { Action, PlayerCombatData } from "../combats.types"
import { getActivePlayersWithAp, getIsActionEndingRound } from "../utils/combat-utils"
import itemAction from "./item-action"
import prepareAction from "./prepare-action"
import saveAction from "./save-action"
import setNewRound from "./set-new-round"
import waitAction from "./wait-action"

export type CombatActionParams = {
  action: Action
  combat: Combat
  contenders: Record<string, { char: Playable; combatData: PlayerCombatData }>
  item?: Clothing | Consumable | MiscObject | Weapon
}

export default function doCombatAction(dbType: keyof typeof repositoryMap = "rtdb") {
  const statusRepo = repositoryMap[dbType].statusRepository

  return async ({ action, combat, contenders, item }: CombatActionParams) => {
    const { apCost = 0, actorId, actionType, actionSubtype } = action
    const { charId, status, meta } = contenders[actorId].char

    if (apCost > status.currAp) throw new Error("Not enough AP to perform this action")

    const isEndingRound = getIsActionEndingRound(contenders, { apCost, ...action })

    const promises = []

    // dispatch action
    switch (actionType) {
      case "movement":
        // no further operations needed (handled in saveAction)
        break

      case "wait": {
        if (isEndingRound) throw new Error("End of the round: invalid action")
        const activePlayersWithAp = getActivePlayersWithAp(contenders)
        if (activePlayersWithAp.length <= 1) throw new Error("No other players with AP")
        promises.push(waitAction(dbType)({ action, contenders }))
        break
      }

      case "prepare":
        promises.push(prepareAction(dbType)({ action, contenders, combat }))
        break

      case "item":
        if (actionSubtype !== "pickUp") {
          if (!item) throw new Error("Item is required for item action")
        }
        promises.push(itemAction(dbType)({ action, contenders, combat, item }))
        break

      default:
        throw new Error(`Unknown action type: ${actionType}`)
    }

    // save action in combat
    promises.push(saveAction(dbType)({ action, combat, contenders }))

    // handle char status reset & new round creation
    if (isEndingRound) {
      promises.push(setNewRound(dbType)({ contenders, combat }))
    } else {
      const charType = meta.isNpc ? "npcs" : "characters"
      const newAp = status.currAp - apCost
      promises.push(statusRepo.setChild({ charId, charType, childKey: "currAp" }, newAp))
    }

    return Promise.all(promises)
  }
}
