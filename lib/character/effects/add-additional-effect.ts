import { UseCasesConfig } from "lib/get-use-case.types"
import repositoryMap from "lib/shared/db/get-repository"

import { DbEffectData } from "./effects.types"

export default function addAdditionalEffect({ db }: UseCasesConfig) {
  const repository = repositoryMap[db].additionalEffectsRepository

  return (params: DbEffectData) => repository.setChild({ childKey: params.id }, params)
}
