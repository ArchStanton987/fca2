import {
  getCombatStatus,
  getCombatStatuses
} from "lib/character/combat-status/combat-status-provider"
import { getCharInfo } from "lib/character/info/info-provider"
import { UseCasesConfig } from "lib/get-use-case.types"
import Clothing from "lib/objects/data/clothings/Clothing"
import Consumable from "lib/objects/data/consumables/Consumable"
import MiscObject from "lib/objects/data/misc-objects/MiscObject"
import Weapon from "lib/objects/data/weapons/Weapon"
import weaponsMap from "lib/objects/data/weapons/weapons"
import repositoryMap from "lib/shared/db/get-repository"

import { DbAction } from "../combats.types"
import { getActivePlayersWithAp, getIsActionEndingRound } from "../utils/combat-utils"
import applyDamageEntries from "./apply-damage-entries"
import itemAction from "./item-action"
import prepareAction from "./prepare-action"
import saveAction from "./save-action"
import setNewRound from "./set-new-round"
import { getCombat } from "./sub-combat"
import waitAction from "./wait-action"
import weaponAction from "./weapon-action"

export type CombatActionParams = {
  combatId: string
  action: DbAction & { actorId: string }
  item?: Clothing | Consumable | MiscObject | Weapon
}

export default function doCombatAction(config: UseCasesConfig) {
  const { db, store } = config
  const combatStatusRepo = repositoryMap[db].combatStatusRepository

  return async ({ action, combatId, item }: CombatActionParams) => {
    const { apCost = 0, actorId, actionType, actionSubtype } = action
    const charId = actorId
    const combatStatus = getCombatStatus(store, charId)
    const meta = getCharInfo(store, charId)
    const combat = getCombat(store, combatId)

    const roundId = combat?.currRoundId

    if (apCost > combatStatus.currAp) throw new Error("Not enough AP to perform this action")

    const combatStatuses = getCombatStatuses(store, combat?.contendersIds ?? [])
    const isEndingRound = getIsActionEndingRound(combatStatuses, { apCost, ...action })

    const promises = []

    // dispatch action
    switch (actionType) {
      case "weapon": {
        // handle case with species which can't carry weapon
        if (meta.speciesId === "robot" || meta.speciesId === "beast") break
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
        promises.push(waitAction(config)({ action }))
        break
      }

      case "prepare":
        promises.push(prepareAction(config)({ action, roundId }))
        break

      case "item":
        if (actionSubtype !== "pickUp") {
          if (!item) throw new Error("Item is required for item action")
        }
        promises.push(itemAction(config)({ action, item }))
        break

      default:
        throw new Error(`Unknown action type: ${actionType}`)
    }

    // apply damage entries
    if (action?.healthChangeEntries) {
      const damageEntries = action.healthChangeEntries

      promises.push(applyDamageEntries(config)({ roundId, damageEntries }))
    }

    // save action in combat
    promises.push(saveAction(config)({ action, combat, contenders: combatStatuses }))

    // handle char status reset & new round creation
    if (isEndingRound) {
      promises.push(setNewRound(config)({ combatId }))
    } else {
      // set actor action points
      const newAp = combatStatus.currAp - apCost
      promises.push(combatStatusRepo.patch({ charId }, { currAp: newAp }))
    }

    return Promise.all(promises)
  }
}
