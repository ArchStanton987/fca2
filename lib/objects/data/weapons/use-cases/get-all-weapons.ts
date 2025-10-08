import { queryOptions } from "@tanstack/react-query"
import { useSubCollection } from "lib/shared/db/useSub"

import WeaponMappers from "../weapons.mappers"
import { DbWeaponData, WeaponData } from "../weapons.types"

export const getCreatedWeaponOptions = () =>
  queryOptions({
    queryKey: ["v3", "additional", "weapons"],
    queryFn: () => new Promise<Record<string, WeaponData>>(() => {})
  })

const cb = (payload: DbWeaponData) => WeaponMappers.dbWeaponDataToDomain(payload)

export const useSubCreatedWeapons = () => {
  useSubCollection(getCreatedWeaponOptions().queryKey.join("/"), cb)
}
