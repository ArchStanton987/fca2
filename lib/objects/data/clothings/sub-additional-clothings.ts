import { AdditionalClothingsParams } from "lib/shared/db/api-rtdb"
import repositoryMap from "lib/shared/db/get-repository"

export default function subAdditionalClothings(dbType: keyof typeof repositoryMap = "rtdb") {
  const repository = repositoryMap[dbType].additionalClothingsRepository

  return (params: AdditionalClothingsParams) => repository.sub(params)
}
