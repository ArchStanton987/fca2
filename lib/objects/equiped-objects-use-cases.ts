import { getRepository } from "lib/RepositoryBuilder"
import Playable from "lib/character/Playable"
import clothingsMap from "lib/objects/data/clothings/clothings"
import { Clothing, ClothingId } from "lib/objects/data/clothings/clothings.types"
import weaponsMap from "lib/objects/data/weapons/weapons"
import { Weapon } from "lib/objects/data/weapons/weapons.types"

import { CreatedElements, defaultCreatedElements } from "./created-elements"
import { EquipableCategory, EquipableObject } from "./fbEquipedObjectsRepository"

const getObjectCategory = (object: EquipableObject): EquipableCategory =>
  "armorClass" in object.data ? "clothings" : "weapons"

const getEquipedObjectsUseCases = (
  db: keyof typeof getRepository = "rtdb",
  { newClothings }: CreatedElements = defaultCreatedElements
) => {
  const repository = getRepository[db].equipedObjects

  const allClothings = { ...clothingsMap, ...newClothings } as unknown as typeof clothingsMap

  return {
    get: (charId: string, category: EquipableCategory, dbKey: EquipableObject["dbKey"]) =>
      repository.get(charId, category, dbKey),

    getByCategory: (charId: string, category: EquipableCategory) =>
      repository.getByCategory(charId, category),

    getAll: (charId: string) => repository.getAll(charId),

    toggle: async (char: Playable, object: Weapon | Clothing) => {
      const { charId, equipedObjects } = char
      const category = getObjectCategory(object)
      const { weapons, clothings } = equipedObjects
      const { dbKey } = object
      if (!object.isEquiped) {
        if (category === "weapons") {
          const is2HandedWeapon = weaponsMap[object.id as Weapon["id"]].isTwoHanded
          const has2HandedWeapon = weapons.some(({ id }) => weaponsMap[id].isTwoHanded)
          const has2EquWeapons = weapons.length >= 2
          if (is2HandedWeapon && weapons.length > 0)
            throw new Error("Pour faire ça, il vous faudrait plus de mains !")
          if (has2HandedWeapon) throw new Error("Pour faire ça, il vous faudrait plus de mains !")
          if (has2EquWeapons) throw new Error("Pour faire ça, il vous faudrait plus de mains !")
        }

        if (category === "clothings") {
          const protectedBodyParts = clothings.map(obj => obj.data.protects).flat()
          const hasClothOnBodyPart = protectedBodyParts.some(part =>
            allClothings[object.id as ClothingId].protects.includes(part)
          )
          if (hasClothOnBodyPart)
            throw new Error(
              "Vous ne pouvez pas avoir plusieurs armures sur la même partie du corps"
            )
        }

        return repository.add(charId, category, object)
      }
      return repository.remove(charId, category, dbKey)
    },

    remove: (charId: string, category: EquipableCategory, dbKey: EquipableObject["dbKey"]) =>
      repository.remove(charId, category, dbKey)
  }
}

export default getEquipedObjectsUseCases
