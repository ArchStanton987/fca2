import repositoryMap from "lib/shared/db/get-repository"

import { DbClothingData } from "./clothings.types"

export default function addAdditionalClothings(dbType: keyof typeof repositoryMap = "rtdb") {
  const repository = repositoryMap[dbType].additionalClothingsRepository

  return (params: DbClothingData) => repository.setChild({ childKey: params.id }, params)
}
