import { getRepository } from "lib/RepositoryBuilder"
import Playable from "lib/character/Playable"
import { UseCaseConfig } from "lib/get-use-cases"
import { Weapon, WeaponActionId } from "lib/objects/data/weapons/weapons.types"

const getWeaponsUseCases = ({ db, createdElements }: UseCaseConfig) => {
  const invRepository = getRepository[db].inventory
  const equObjRepository = getRepository[db].equipedObjects

  return {
    load: async (char: Playable, weapon: Weapon) => {
      const { charId } = char
      const { data, ammo, inMagazine = 0 } = weapon
      const { ammoType, magazine } = data

      // VALIDATIONS
      if (ammoType === null) throw new Error("Weapon doesn't use ammo")
      if (magazine === null) throw new Error("Weapon doesn't use ammo")
      if (ammo === 0 || ammo === undefined) throw new Error("No ammo")
      if (inMagazine === data.magazine) throw new Error("Magazine is full")

      // GET NEW AMMO AND INMAGAZINE VALUES
      const missingInMag = magazine - inMagazine
      const toLoad = ammo >= missingInMag ? missingInMag : ammo
      const newInMag = inMagazine + toLoad
      const newAmmo = ammo - toLoad

      // UPDATE DB
      const promises = []
      // update inventory
      promises.push(
        invRepository.updateCollectible(charId, "weapons", weapon, "inMagazine", newInMag)
      )
      const invAmmoPayload = { category: "ammo" as const, id: ammoType, newValue: newAmmo }
      promises.push(invRepository.groupUpdateRecords(charId, [invAmmoPayload]))
      // update equipped object
      const equObjPayload = { id: weapon.id, inMagazine: newInMag }
      promises.push(equObjRepository.update(charId, "weapons", weapon.dbKey, equObjPayload))
      return Promise.all(promises)
    },

    unload: async (char: Playable, weapon: Weapon) => {
      const { charId } = char
      const { inMagazine = 0, data } = weapon
      const { ammoType } = data
      // VALIDATIONS
      if (ammoType === null) throw new Error("Weapon doesn't use ammo")
      if (inMagazine === 0) throw new Error("No ammo in magazine")

      // GET NEW AMMO AND INMAGAZINE VALUES
      const newInMag = 0
      const newAmmo = weapon.ammo + inMagazine

      // UPDATE DB
      const promises = []
      // update inventory
      promises.push(
        invRepository.updateCollectible(charId, "weapons", weapon, "inMagazine", newInMag)
      )
      const invAmmoPayload = { category: "ammo" as const, id: ammoType, newValue: newAmmo }
      promises.push(invRepository.groupUpdateRecords(charId, [invAmmoPayload]))
      // update equipped object
      const equObjPayload = { id: weapon.id, inMagazine: newInMag }
      promises.push(equObjRepository.update(charId, "weapons", weapon.dbKey, equObjPayload))
      return Promise.all(promises)
    },

    use: async (char: Playable, weapon: Weapon, actionId: WeaponActionId) => {
      const { charId } = char
      const { data, inMagazine = 0 } = weapon
      const { ammoType, ammoPerBurst, ammoPerShot } = data

      const promises = []

      // HANDLE FIREARM
      const isFirearm = ammoType !== null
      if (isFirearm) {
        // GET NEW INMAGAZINE VALUES
        const isBasicAmmoUse = actionId === "basic" || actionId === "aim"
        const ammoToRemove = (isBasicAmmoUse ? ammoPerShot : ammoPerBurst) ?? 0
        const newInMag = inMagazine - ammoToRemove

        // UPDATE DB
        // remove ammo from equipped object db
        const equObjPayload = { id: weapon.id, inMagazine: newInMag }
        promises.push(equObjRepository.update(charId, "weapons", weapon.dbKey, equObjPayload))
        // remove ammo from inventory db
        promises.push(
          invRepository.updateCollectible(charId, "weapons", weapon, "inMagazine", newInMag)
        )
      }
      return Promise.all(promises)
    }
  }
}

export default getWeaponsUseCases
