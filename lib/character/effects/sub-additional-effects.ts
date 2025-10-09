import { UseCasesConfig } from "lib/get-use-case.types"
import { AdditionalEffectsParams } from "lib/shared/db/api-rtdb"
import repositoryMap from "lib/shared/db/get-repository"

export default function subAdditionalEffects({ db }: UseCasesConfig) {
  const repository = repositoryMap[db].additionalEffectsRepository

  return (params: AdditionalEffectsParams) => repository.sub(params)
}
