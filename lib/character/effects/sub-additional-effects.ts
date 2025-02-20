import { AdditionalEffectsParams } from "lib/shared/db/api-rtdb"
import repositoryMap from "lib/shared/db/get-repository"

export default function subAdditionalEffects(dbType: keyof typeof repositoryMap = "rtdb") {
  const repository = repositoryMap[dbType].additionalEffectsRepository

  return (params: AdditionalEffectsParams) => repository.sub(params)
}
