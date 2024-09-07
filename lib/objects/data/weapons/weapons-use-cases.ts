import { getRepository } from "lib/RepositoryBuilder"
import Character from "lib/character/Character"
import {
  getApCost,
  getCanShoot,
  getCanShootAim,
  getCanShootBurst
} from "lib/objects/data/weapons/weapons-utils"
import { Weapon, WeaponActionId } from "lib/objects/data/weapons/weapons.types"

const getWeaponsUseCases = (db: keyof typeof getRepository = "rtdb") => {
  const invRepository = getRepository[db].inventory
  const equObjRepository = getRepository[db].equipedObjects
  const statusRepository = getRepository[db].status

  return {
    load: async (
      char: Character,
      weapon: Weapon,
      apCostOverride: number | undefined = undefined
    ) => {
      const { charId } = char
      const { data, ammo, inMagazine = 0 } = weapon
      const { ammoType, magazine } = data
      const apCost = apCostOverride || 3

      // VALIDATIONS
      if (apCost > char.status.currAp) throw new Error("Not enough action points")
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
      // update action points
      promises.push(statusRepository.updateElement(charId, "currAp", apCost))
      return Promise.all(promises)
    },

    unload: async (
      char: Character,
      weapon: Weapon,
      apCostOverride: number | undefined = undefined
    ) => {
      const { charId } = char
      const { inMagazine = 0, data } = weapon
      const { ammoType } = data
      const apCost = apCostOverride || 3
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
      // update action points
      promises.push(statusRepository.updateElement(charId, "currAp", apCost))
      return Promise.all(promises)
    },

    use: async (
      char: Character,
      weapon: Weapon,
      actionId: WeaponActionId,
      apCostOverride: number | undefined = undefined
    ) => {
      const { charId, status } = char
      const { data, inMagazine = 0 } = weapon
      const { ammoType, ammoPerBurst, ammoPerShot } = data
      const apCost = apCostOverride || getApCost(weapon, char, actionId)

      // VALIDATIONS
      if (apCost === null) throw new Error("Invalid weapon use type")
      if (apCost > status.currAp) throw new Error("Not enough action points")

      const promises = []

      // HANDLE FIREARM
      const isFirearm = ammoType !== null
      if (isFirearm) {
        // FIREARM VALIDATIONS
        if (actionId === "basic" && !getCanShoot(weapon, char)) throw new Error("Can't shoot")
        if (actionId === "aim" && !getCanShootAim(weapon, char)) throw new Error("Can't aim")
        if (actionId === "burst" && !getCanShootBurst(weapon, char)) throw new Error("Can't burst")

        // GET NEW INMAGAZINE VALUES
        const isBasicAmmoUse = actionId === "basic" || actionId === "aim"
        const ammoToRemove = (isBasicAmmoUse ? ammoPerShot : ammoPerBurst) || 0
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
      // REMOVE AP
      const charRepository = getRepository[db].status
      promises.push(charRepository.updateElement(charId, "currAp", status.currAp - apCost))
      return Promise.all(promises)
    }
  }
}

export default getWeaponsUseCases
