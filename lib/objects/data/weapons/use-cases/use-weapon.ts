import { UseCasesConfig } from "lib/get-use-case.types"
import drop from "lib/inventory/use-cases/drop"
import repositoryMap from "lib/shared/db/get-repository"

import Weapon from "../Weapon"
import { WeaponActionId } from "../weapons.types"

export type UseWeaponParams = {
  charId: string
  weapon: Weapon
  actionId: WeaponActionId
}

export default function useWeapon(config: UseCasesConfig) {
  const { db } = config
  const itemsRepo = repositoryMap[db].itemsRepository

  return ({ charId, weapon, actionId }: UseWeaponParams) => {
    const { data } = weapon
    const inMagazine = weapon.inMagazine ?? 0
    const { ammoType, ammoPerBurst, ammoPerShot } = data

    const promises = []

    // HANDLE FIREARM
    const isFirearm = ammoType !== null
    if (isFirearm) {
      // GET NEW INMAGAZINE VALUES
      const isBasicAmmoUse = actionId === "basic" || actionId === "aim"
      const ammoToRemove = (isBasicAmmoUse ? ammoPerShot : ammoPerBurst) ?? 0
      const newInMag = inMagazine - ammoToRemove

      // update weapon magazine
      promises.push(
        // @ts-expect-error
        itemsRepo.patchChild({ charId, dbKey: weapon.dbKey, childKey: "inMagazine" }, newInMag)
      )
    }

    // HANDLE THROWN & TRAPS
    const isThrown = weapon.data.skillId === "throw"
    const isTrap = weapon.data.skillId === "trap"
    if (isThrown || isTrap) {
      promises.push(drop(config)({ charId, item: weapon }))
    }

    return Promise.all(promises)
  }
}
