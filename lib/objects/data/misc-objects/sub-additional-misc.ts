import { AdditionalMiscParams } from "lib/shared/db/api-rtdb"
import repositoryMap from "lib/shared/db/get-repository"

export default function subAdditionalMisc(dbType: keyof typeof repositoryMap = "rtdb") {
  const repository = repositoryMap[dbType].additionalMiscRepository

  return (params: AdditionalMiscParams) => repository.sub(params)
}
