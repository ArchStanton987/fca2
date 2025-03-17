import repositoryMap from "lib/shared/db/get-repository"

import { DbConsumableData } from "./consumables.types"

export default function addAdditionalConsumable(dbType: keyof typeof repositoryMap = "rtdb") {
  const repository = repositoryMap[dbType].additionalConsumablesRepository

  return (params: DbConsumableData) => repository.setChild({ childKey: params.id }, params)
}
