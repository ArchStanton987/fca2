import { UseCaseConfig } from "lib/get-use-cases"
import repositoryMap from "lib/shared/db/get-repository"

import { DbMiscObjectData } from "./misc-objects-types"

export default function addAdditionalMisc({ db }: UseCaseConfig) {
  const repository = repositoryMap[db].additionalMiscRepository

  return (params: DbMiscObjectData) => repository.setChild({ childKey: params.id }, params)
}
