import { getRepository } from "lib/RepositoryBuilder"
import Character from "lib/character/Character"
import { Weapon } from "lib/objects/data/weapons/weapons.types"

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

      const toAdd = inMagazine === undefined ? data.magazine : data.magazine - inMagazine
      const newInMag = inMagazine === undefined ? toAdd : inMagazine + toAdd
      return repository.updateCollectible(char.charId, "weapons", weapon, "inMagazine", newInMag)
    },

    unload: async (char: Character, weapon: Weapon) => {
      const { inMagazine } = weapon
      if (inMagazine === undefined || inMagazine === 0) throw new Error("No ammo in magazine")
      return repository.updateCollectible(char.charId, "weapons", weapon, "inMagazine", 0)
    }
  }
}

export default getWeaponsUseCases
