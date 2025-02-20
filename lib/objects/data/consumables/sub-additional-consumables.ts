import { AdditionalConsumablesParams } from "lib/shared/db/api-rtdb"
import repositoryMap from "lib/shared/db/get-repository"

export default function subAdditionalConsumables(dbType: keyof typeof repositoryMap = "rtdb") {
  const repository = repositoryMap[dbType].additionalConsumablesRepository

  return (params: AdditionalConsumablesParams) => repository.sub(params)
}
