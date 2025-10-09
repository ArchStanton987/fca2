import { UseCasesConfig } from "lib/get-use-case.types"
import repositoryMap from "lib/shared/db/get-repository"

import { DbClothingData } from "./clothings.types"

export default function addAdditionalClothings({ db }: UseCasesConfig) {
  const repository = repositoryMap[db].additionalClothingsRepository

  return (params: DbClothingData) => repository.setChild({ childKey: params.id }, params)
}
