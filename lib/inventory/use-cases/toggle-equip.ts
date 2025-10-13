import { UseCasesConfig } from "lib/get-use-case.types"
import { ClothingId } from "lib/objects/data/clothings/clothings.types"
import repositoryMap from "lib/shared/db/get-repository"

import { Item, getItems } from "../use-sub-inv-cat"

export type ToggleEquipParams = {
  charId: string
  itemId: string
  equippedItems: Record<string, Item>
}

export default function toggleEquip({ db, collectiblesData, store }: UseCasesConfig) {
  const itemsRepo = repositoryMap[db].itemsRepository
  const { clothings } = collectiblesData

  return ({ charId, itemId }: ToggleEquipParams) => {
    const items = getItems(store, charId)
    const equippedItems = Object.fromEntries(
      Object.entries(items)
        .filter(([, value]) => value.isEquipped)
        .map(([id, value]) => [id, value])
    )
    const item = equippedItems[itemId]
    if (!item) throw new Error(`Item with id : ${itemId} wasn't found in equipped items`)

    // UNEQUIP
    if (item.isEquipped) {
      return itemsRepo.patchChild({ charId, childKey: "isEquipped" }, false)
    }

    // EQUIP
    const handsTaken = Object.values(equippedItems).reduce((acc, it) => {
      if (it.category === "misc" || it.category === "clothings") return acc
      const hands = it.category === "weapons" && it.data.isTwoHanded ? 2 : 1
      return acc + hands
    }, 0)
    const handsNeeded = item.category === "weapons" && item.data.isTwoHanded ? 2 : 1
    const emptyHands = 2 - handsTaken
    if (handsNeeded > emptyHands) throw new Error("Pour faire ça, il vous faudrait plus de mains !")

    if (item.category === "clothings") {
      const equItemsArray = Object.values(equippedItems)
      const protectedBodyParts = equItemsArray
        .filter(obj => obj.category === "clothings")
        .map(obj => obj.data.protects)
        .flat()
      const hasClothOnBodyPart = protectedBodyParts.some(part =>
        clothings[item.id as ClothingId].protects.includes(part)
      )
      if (hasClothOnBodyPart)
        throw new Error("Vous ne pouvez pas avoir plusieurs armures sur la même partie du corps")
    }

    return itemsRepo.patchChild({ charId, childKey: "isEquipped" }, true)
  }
}
