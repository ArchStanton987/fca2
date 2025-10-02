import { UseCaseConfig } from "lib/get-use-cases"
import repositoryMap from "lib/shared/db/get-repository"

import { DbClothingData } from "./clothings.types"

export default function addAdditionalClothings({ db }: UseCaseConfig) {
  const repository = repositoryMap[db].additionalClothingsRepository

  return (params: DbClothingData) => repository.setChild({ childKey: params.id }, params)
}
