import { UseCaseConfig } from "lib/get-use-cases"
import repositoryMap from "lib/shared/db/get-repository"

import { DbConsumableData } from "./consumables.types"

export default function addAdditionalConsumable({ db }: UseCaseConfig) {
  const repository = repositoryMap[db].additionalConsumablesRepository

  return (params: DbConsumableData) => repository.setChild({ childKey: params.id }, params)
}
