import { UseCasesConfig } from "lib/get-use-case.types"
import repositoryMap from "lib/shared/db/get-repository"

import { DbMiscObjectData } from "./misc-objects-types"

export default function addAdditionalMisc({ db }: UseCasesConfig) {
  const repository = repositoryMap[db].additionalMiscRepository

  return (params: DbMiscObjectData) => repository.setChild({ childKey: params.id }, params)
}
