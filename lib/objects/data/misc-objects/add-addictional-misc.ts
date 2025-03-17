import repositoryMap from "lib/shared/db/get-repository"

import { DbMiscObjectData } from "./misc-objects-types"

export default function addAdditionalMisc(dbType: keyof typeof repositoryMap = "rtdb") {
  const repository = repositoryMap[dbType].additionalMiscRepository

  return (params: DbMiscObjectData) => repository.setChild({ childKey: params.id }, params)
}
