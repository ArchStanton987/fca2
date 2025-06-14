import Playable from "lib/character/Playable"
import getWeaponsUseCases from "lib/objects/data/weapons/weapons-use-cases"
import { Weapon } from "lib/objects/data/weapons/weapons.types"
import getInventoryUseCases from "lib/objects/inventory-use-cases"
import repositoryMap from "lib/shared/db/get-repository"

import Combat from "../Combat"
import { Action, PlayerCombatData } from "../combats.types"

export type WeaponActionParams = {
  action: Action
  combat: Combat
  contenders: Record<string, { char: Playable; combatData: PlayerCombatData }>
  item?: Weapon
}

export default function weaponAction(dbType: keyof typeof repositoryMap = "rtdb") {
  const { load, unload, use } = getWeaponsUseCases(dbType)
  const { drop } = getInventoryUseCases(dbType)
  const statusRepo = repositoryMap[dbType].statusRepository
  return async ({ action, contenders, item }: WeaponActionParams) => {
    const { actionSubtype = "", actorId, apCost } = action
    const { char } = contenders[actorId]
    const { charId, meta } = char
    const charType = meta.isNpc ? "npcs" : "characters"

    switch (actionSubtype) {
      case "hit": {
        const newAp = char.status.currAp - (apCost ?? 0)
        return statusRepo.patch({ charId, charType }, { currAp: newAp })
      }
      case "basic":
      case "aim":
      case "burst":
        // handle case with species which can't carry weapon
        if (meta.speciesId === "robot" || meta.speciesId === "animal") {
          const newAp = char.status.currAp - (apCost ?? 0)
          return statusRepo.patch({ charId, charType }, { currAp: newAp })
        }
        if (!item) throw new Error("Missing item")
        return use(char, item, actionSubtype, apCost)
      case "reload":
        if (!item) throw new Error("Missing item")
        return load(char, item)
      case "unload":
        if (!item) throw new Error("Missing item")
        return unload(char, item)
      case "throw":
        if (!item) throw new Error("Missing item")
        return drop(charType, charId, item)
      default:
        throw new Error(`Unknown action subtype : ${actionSubtype} for weapon actions`)
    }
  }
}
