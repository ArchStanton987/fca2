import { queryOptions } from "@tanstack/react-query"

import WeaponMappers from "../weapons.mappers"
import { DbWeaponData, WeaponData } from "../weapons.types"

export const getCreatedWeaponOptions = () =>
  queryOptions({
    queryKey: ["v3", "additional", "weapons"],
    queryFn: () => new Promise<Record<string, WeaponData>>(() => {})
  })

export const createdWCb = (payload: DbWeaponData) => WeaponMappers.dbWeaponDataToDomain(payload)
