import { getRepository } from "lib/RepositoryBuilder"
import Character from "lib/character/Character"
import { getApCost } from "lib/objects/data/weapons/weapons-utils"
import { Weapon, WeaponUseType } from "lib/objects/data/weapons/weapons.types"

const getWeaponsUseCases = (db: keyof typeof getRepository = "rtdb") => {
  const repository = getRepository[db].inventory

  return {
    load: async (char: Character, weapon: Weapon) => {
      const { data, ammo, inMagazine } = weapon
      if (data.ammoType === null) throw new Error("Weapon doesn't use ammo")
      if (data.magazine === null) throw new Error("Weapon doesn't use ammo")
      if (ammo === 0) throw new Error("No ammo")
      if (typeof inMagazine === "number" && inMagazine === data.magazine)
        throw new Error("Magazine is full")

      const missingInMag = data.magazine - (inMagazine || 0)
      const toLoad = ammo >= missingInMag ? missingInMag : ammo
      return repository.updateCollectible(char.charId, "weapons", weapon, "inMagazine", toLoad)
    },

    unload: async (char: Character, weapon: Weapon) => {
      const { inMagazine } = weapon
      if (inMagazine === undefined || inMagazine === 0) throw new Error("No ammo in magazine")
      return repository.updateCollectible(char.charId, "weapons", weapon, "inMagazine", 0)
    }

    // use: async(char: Character, weapon: Weapon, useType: WeaponUseType = "basic") => {
    //   const apCost = getApCost(weapon, char, useType)
    //   const { currAp } = char.status
    //   if (currAp < apCost) throw new Error("Not enough action points")

    // }
  }
}

export default getWeaponsUseCases
