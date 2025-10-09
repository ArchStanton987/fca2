import { UseCasesConfig } from "lib/get-use-case.types"
import { AdditionalMiscParams } from "lib/shared/db/api-rtdb"
import repositoryMap from "lib/shared/db/get-repository"

export default function subAdditionalMisc({ db }: UseCasesConfig) {
  const repository = repositoryMap[db].additionalMiscRepository

  return (params: AdditionalMiscParams) => repository.sub(params)
}
