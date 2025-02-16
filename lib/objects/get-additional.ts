import { AdditionalParams } from "lib/shared/db/api-rtdb"
import repositoryMap from "lib/shared/db/get-repository"

export default function getAdditional(dbType: keyof typeof repositoryMap = "rtdb") {
  const repository = repositoryMap[dbType].additionalRepository

  return (params: AdditionalParams) => repository.get(params)
}
