import addEffect from "lib/character/effects/use-cases/add-effect"
import { DbHealth } from "lib/character/health/Health"
import { getHealth } from "lib/character/health/health-provider"
import updateHp from "lib/character/health/use-cases/update-hp"
import updateRads from "lib/character/health/use-cases/update-rads"
import { applyMod } from "lib/common/utils/char-calc"
import { UseCasesConfig } from "lib/get-use-case.types"
import Consumable from "lib/objects/data/consumables/Consumable"
import repositoryMap from "lib/shared/db/get-repository"

import drop from "./drop"

export type ConsumeParams = {
  charId: string
  consumable: Consumable
}

export default function consume(config: UseCasesConfig) {
  const { store, db } = config
  const itemsRepo = repositoryMap[db].itemsRepository
  return ({ charId, consumable }: ConsumeParams) => {
    const { data, remainingUse } = consumable

    const promises = []

    const { effectId, modifiers } = data

    // add effect related to consumable
    if (effectId) {
      promises.push(addEffect(config)({ effectId, charId }))
    }

    // apply modifiers related to consumable
    if (modifiers) {
      const health = getHealth(store, charId)
      const updates: Partial<DbHealth> = {}
      modifiers.forEach(mod => {
        const calcValue = applyMod(health[mod.id], mod)
        updates[mod.id] = calcValue
        if (mod.id === "currHp") {
          promises.push(updateHp(config)({ charId, newHpValue: calcValue }))
        }
        if (mod.id === "rads") {
          promises.push(updateRads(config)({ charId, newRadsValue: calcValue }))
        }
      })
    }

    // handle object in inventory
    const shouldRemoveObject = remainingUse === null || remainingUse <= 1
    const { dbKey } = consumable
    if (shouldRemoveObject) {
      promises.push(drop(config)({ charId, item: consumable }))
    } else {
      promises.push(
        itemsRepo.patch(
          { charId, dbKey, childKey: "remainingUse" },
          { remainingUse: remainingUse - 1 }
        )
      )
    }
  }
}
