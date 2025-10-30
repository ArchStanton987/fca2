import { UseCasesConfig } from "lib/get-use-case.types"
import repositoryMap from "lib/shared/db/get-repository"

import { DbConsumableData } from "./consumables.types"

export default function addAdditionalConsumable({ db }: UseCasesConfig) {
  const repository = repositoryMap[db].additionalConsumablesRepository

  return (params: DbConsumableData) => {
    const payload = JSON.parse(JSON.stringify(params))
    return repository.setChild({ childKey: params.id }, payload)
  }
}
