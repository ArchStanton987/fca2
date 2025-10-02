import { UseCaseConfig } from "lib/get-use-cases"
import { AdditionalEffectsParams } from "lib/shared/db/api-rtdb"
import repositoryMap from "lib/shared/db/get-repository"

export default function subAdditionalEffects({ db }: UseCaseConfig) {
  const repository = repositoryMap[db].additionalEffectsRepository

  return (params: AdditionalEffectsParams) => repository.sub(params)
}
