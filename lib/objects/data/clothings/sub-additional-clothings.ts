import { UseCaseConfig } from "lib/get-use-cases"
import { AdditionalClothingsParams } from "lib/shared/db/api-rtdb"
import repositoryMap from "lib/shared/db/get-repository"

export default function subAdditionalClothings({ db }: UseCaseConfig) {
  const repository = repositoryMap[db].additionalClothingsRepository

  return (params: AdditionalClothingsParams) => repository.sub(params)
}
