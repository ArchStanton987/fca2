import { UseCaseConfig } from "lib/get-use-cases"
import { AdditionalConsumablesParams } from "lib/shared/db/api-rtdb"
import repositoryMap from "lib/shared/db/get-repository"

export default function subAdditionalConsumables({ db }: UseCaseConfig) {
  const repository = repositoryMap[db].additionalConsumablesRepository

  return (params: AdditionalConsumablesParams) => repository.sub(params)
}
