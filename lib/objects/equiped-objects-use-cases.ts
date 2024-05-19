import { getRepository } from "lib/RepositoryBuilder"
import Character from "lib/character/Character"
import clothingsMap from "lib/objects/data/clothings/clothings"
import { Clothing, ClothingId } from "lib/objects/data/clothings/clothings.types"
import weaponsMap from "lib/objects/data/weapons/weapons"
import { Weapon } from "lib/objects/data/weapons/weapons.types"

import { EquipableCategory, EquipableObject } from "./fbEquipedObjectsRepository"

const getObjectCategory = (object: EquipableObject): EquipableCategory =>
  "armorClass" in object.data ? "clothings" : "weapons"

const getEquipedObjectsUseCases = (db: keyof typeof getRepository = "rtdb") => {
  const repository = getRepository[db].equipedObjects

  return {
    get: (charId: string, category: EquipableCategory, dbKey: EquipableObject["dbKey"]) =>
      repository.get(charId, category, dbKey),

    getByCategory: (charId: string, category: EquipableCategory) =>
      repository.getByCategory(charId, category),

    getAll: (charId: string) => repository.getAll(charId),

    toggle: async (char: Character, object: Weapon | Clothing) => {
      const category = getObjectCategory(object)
      const { weapons, clothings } = char.equipedObjects
      const { dbKey } = object
      if (!object.isEquiped) {
        if (category === "weapons") {
          const hasHeavyWeapon = weapons.some(({ id }) => weaponsMap[id].skill === "heavyWeapons")
          const has2EquWeapons = weapons.length >= 2
          if (hasHeavyWeapon) throw new Error("Vous ne pouvez pas équiper plus d'une arme lourde")
          if (has2EquWeapons) throw new Error("Vous ne pouvez pas équiper plus de deux armes")
        }

        if (category === "clothings") {
          const protectedBodyParts = clothings.map(obj => obj.data.protects).flat()
          const hasClothOnBodyPart = protectedBodyParts.some(part =>
            clothingsMap[object.id as ClothingId].protects.includes(part)
          )
          if (hasClothOnBodyPart)
            throw new Error(
              "Vous ne pouvez pas avoir plusieurs armures sur la même partie du corps"
            )
        }

        return repository.add(char.charId, category, object)
      }
      return repository.remove(char.charId, category, dbKey)
    },

    remove: (charId: string, category: EquipableCategory, dbKey: EquipableObject["dbKey"]) =>
      repository.remove(charId, category, dbKey)
  }
}

export default getEquipedObjectsUseCases
