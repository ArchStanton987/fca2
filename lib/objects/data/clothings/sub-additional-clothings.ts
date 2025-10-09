import { UseCasesConfig } from "lib/get-use-case.types"
import { AdditionalClothingsParams } from "lib/shared/db/api-rtdb"
import repositoryMap from "lib/shared/db/get-repository"

export default function subAdditionalClothings({ db }: UseCasesConfig) {
  const repository = repositoryMap[db].additionalClothingsRepository

  return (params: AdditionalClothingsParams) => repository.sub(params)
}
