import { UseCaseConfig } from "lib/get-use-cases"
import { AdditionalMiscParams } from "lib/shared/db/api-rtdb"
import repositoryMap from "lib/shared/db/get-repository"

export default function subAdditionalMisc({ db }: UseCaseConfig) {
  const repository = repositoryMap[db].additionalMiscRepository

  return (params: AdditionalMiscParams) => repository.sub(params)
}
