import { UseCasesConfig } from "lib/get-use-case.types"
import { getAmmo } from "lib/inventory/use-sub-inv-cat"
import repositoryMap from "lib/shared/db/get-repository"

import updateAmmo from "../../ammo/use-cases/update-ammo"
import Weapon from "../Weapon"

export type LoadWeaponParams = {
  charId: string
  weapon: Weapon
}

export default function loadWeapon(config: UseCasesConfig) {
  const { db, store } = config
  const itemsRepo = repositoryMap[db].itemsRepository

  return ({ charId, weapon }: LoadWeaponParams) => {
    const { data } = weapon
    const inMagazine = weapon.inMagazine ?? 0
    const { ammoType, magazine } = data

    // VALIDATIONS
    const charAmmo = getAmmo(store, charId)
    const ammo = weapon.getAmmoCount(charAmmo) ?? 0
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
