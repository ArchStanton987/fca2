import { UseCasesConfig } from "lib/get-use-case.types"
import repositoryMap from "lib/shared/db/get-repository"

import { DbConsumableData } from "./consumables.types"

export default function addAdditionalConsumable({ db }: UseCasesConfig) {
  const repository = repositoryMap[db].additionalConsumablesRepository

  return (params: DbConsumableData) => repository.setChild({ childKey: params.id }, params)
}
