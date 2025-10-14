import { UseCasesConfig } from "lib/get-use-case.types"
import { getAmmo } from "lib/inventory/use-sub-inv-cat"
import repositoryMap from "lib/shared/db/get-repository"

import updateAmmo from "../../ammo/use-cases/update-ammo"
import Weapon from "../Weapon"

export type UnloadWeaponParams = {
  charId: string
  weapon: Weapon
}

export default function unloadWeapon(config: UseCasesConfig) {
  const { db, store } = config
  const itemsRepo = repositoryMap[db].itemsRepository

  return ({ charId, weapon }: UnloadWeaponParams) => {
    const { data } = weapon
    const inMagazine = weapon.inMagazine ?? 0
    const { ammoType } = data
    // VALIDATIONS
    if (ammoType === null) throw new Error("Weapon doesn't use ammo")

    // GET NEW AMMO AND INMAGAZINE VALUES
    const charAmmo = getAmmo(store, charId)
    const newInMag = 0
    const currAmmo = weapon.getAmmoCount(charAmmo) ?? 0
    const newAmmo = currAmmo + inMagazine

    // UPDATE DB
    const promises = []
    // update weapon magazine
    promises.push(
      // @ts-expect-error
      itemsRepo.patchChild({ charId, dbKey: weapon.dbKey, childKey: "inMagazine" }, newInMag)
    )
    // update ammo in inventory
    promises.push(updateAmmo(config)({ charId, ammo: { [ammoType]: newAmmo } }))
    return Promise.all(promises)
  }
}
