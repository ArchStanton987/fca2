import Playable from "lib/character/Playable"
import { CreatedElements, defaultCreatedElements } from "lib/objects/created-elements"
import { Clothing } from "lib/objects/data/clothings/clothings.types"
import { Consumable } from "lib/objects/data/consumables/consumables.types"
import { MiscObject } from "lib/objects/data/misc-objects/misc-objects-types"
import weaponsMap from "lib/objects/data/weapons/weapons"
import { Weapon } from "lib/objects/data/weapons/weapons.types"
import repositoryMap from "lib/shared/db/get-repository"

import Combat from "../Combat"
import { Action, PlayerCombatData } from "../combats.types"
import {
  getActionId,
  getActivePlayersWithAp,
  getCurrentRoundId,
  getIsActionEndingRound
} from "../utils/combat-utils"
import applyDamageEntries from "./apply-damage-entries"
import itemAction from "./item-action"
import prepareAction from "./prepare-action"
import saveAction from "./save-action"
import setNewRound from "./set-new-round"
import waitAction from "./wait-action"
import weaponAction from "./weapon-action"

export type CombatActionParams = {
  action: Action
  combat: Combat
  contenders: Record<string, { char: Playable; combatData: PlayerCombatData }>
  item?: Clothing | Consumable | MiscObject | Weapon
}

export default function doCombatAction(
  dbType: keyof typeof repositoryMap = "rtdb",
  newElements: CreatedElements = defaultCreatedElements
) {
  const statusRepo = repositoryMap[dbType].statusRepository

  return async ({ action, combat, contenders, item }: CombatActionParams) => {
    const { apCost = 0, actorId, actionType, actionSubtype } = action
    const { charId, status, meta } = contenders[actorId].char

    const roundId = getCurrentRoundId(combat)
    const actionId = getActionId(combat)
    const storedAction = combat.rounds[roundId][actionId]

    if (apCost > status.currAp) throw new Error("Not enough AP to perform this action")

    const isEndingRound = getIsActionEndingRound(contenders, { apCost, ...action })

    const promises = []

    // dispatch action
    switch (actionType) {
      case "weapon": {
        // handle case with species which can't carry weapon
        if (meta.speciesId === "robot" || meta.speciesId === "animal") {
          const { currAp } = status
          const newAp = currAp - apCost
          promises.push(statusRepo.patch({ charId, charType: "npcs" }, { currAp: newAp }))
          break
        }
        if (!item) throw new Error("Item is required for weapon action")
        if (!(item?.data?.id in weaponsMap)) throw new Error("item is not a weapon")
        // @ts-ignore
        promises.push(weaponAction(dbType)({ action, contenders, item }))
        break
      }
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
        promises.push(itemAction(dbType, newElements)({ action, contenders, combat, item }))
        break

      default:
        throw new Error(`Unknown action type: ${actionType}`)
    }

    // handle ap cost for opposition roll
    if (storedAction?.oppositionRoll) {
      const { opponentId, opponentApCost } = storedAction.oppositionRoll
      const opCharType = contenders[opponentId].char.meta.isNpc ? "npcs" : "characters"
      const newAp = contenders[opponentId].char.secAttr.curr.actionPoints - opponentApCost
      promises.push(
        statusRepo.patch({ charId: opponentId, charType: opCharType }, { currAp: newAp })
      )
    }

    // apply damage entries
    if (storedAction?.healthChangeEntries) {
      const damageEntries = storedAction.healthChangeEntries
      promises.push(applyDamageEntries(dbType)({ combat, contenders, damageEntries }))
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
