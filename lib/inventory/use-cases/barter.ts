import { UseCasesConfig } from "lib/get-use-case.types"
import { AmmoSet, AmmoType } from "lib/objects/data/ammo/ammo.types"
import updateAmmo from "lib/objects/data/ammo/use-cases/update-ammo"
import updateCaps from "lib/objects/data/caps/use-cases/update-caps"
import { ClothingId } from "lib/objects/data/clothings/clothings.types"
import { ConsumableId } from "lib/objects/data/consumables/consumables.types"
import { MiscObjectId } from "lib/objects/data/misc-objects/misc-objects-types"
import { ItemCategory } from "lib/objects/data/objects.types"
import { WeaponId } from "lib/objects/data/weapons/weapons.types"
import repositoryMap from "lib/shared/db/get-repository"

import { Item, getAmmo, getCaps, getItems } from "../use-sub-inv-cat"
import drop from "./drop"

export type BarterParams = {
  charId: string
  items: Record<Item["id"], number>
  caps: number
  ammo: Partial<AmmoSet>
}

const itemCategories: Record<ItemCategory, ItemCategory> = {
  clothings: "clothings",
  consumables: "consumables",
  weapons: "weapons",
  misc: "misc"
}

export default function barter(config: UseCasesConfig) {
  const { db, collectiblesData, store } = config
  const itemsRepo = repositoryMap[db].itemsRepository
  const { weapons, clothings, consumables, miscObjects } = collectiblesData

  return ({ charId, items, caps, ammo }: BarterParams) => {
    const promises = []

    // handle items
    if (Object.keys(items).length > 0) {
      Object.entries(items).forEach(([id, count]) => {
        let item
        let category
        if (id in clothings) category = itemCategories.clothings
        if (id in miscObjects) category = itemCategories.misc
        if (id in consumables) category = itemCategories.consumables
        if (id in weapons) category = itemCategories.weapons

        if (count > 0) {
          switch (category) {
            case "weapons": {
              item = {
                id: id as WeaponId,
                isEquipped: false,
                category,
                inMagazine: weapons[id].ammoType ? 0 : undefined
              }
              break
            }
            case "clothings": {
              item = { id: id as ClothingId, category, isEquipped: false }
              break
            }
            case "consumables": {
              item = {
                id: id as ConsumableId,
                category,
                isEquipped: false,
                remainingUse: consumables[id].maxUsage
              }
              break
            }
            case "misc": {
              item = { id: id as MiscObjectId, category, isEquipped: false }
              break
            }
            default:
              throw new Error(`Unknown category : ${category}`)
          }

          for (let i = 0; i < count; i += 1) {
            promises.push(itemsRepo.add({ charId }, item))
          }
        }

        if (count < 0) {
          const inInvItems = getItems(store, charId)
          const validItems = Object.entries(inInvItems).filter(([invId]) => invId === id)
          validItems.forEach(([, obj]) => {
            promises.push(drop(config)({ charId, item: obj }))
          })
        }
      })
    }

    // handle caps
    if (caps !== 0) {
      const currCaps = getCaps(store, charId)
      const newValue = currCaps + caps
      promises.push(updateCaps(config)({ charId, newValue }))
    }

    // handle ammo
    if (Object.keys(ammo).length > 0) {
      const charAmmo = getAmmo(store, charId)
      const newAmmo = Object.fromEntries(
        Object.entries(ammo).map(([type, count]) => [type, charAmmo[type as AmmoType] + count])
      )
      promises.push(updateAmmo(config)({ charId, ammo: newAmmo }))
    }

    return Promise.all(promises)
  }
}
