import repositoryMap from "lib/shared/db/get-repository"

import { DbEffectData } from "./effects.types"

export default function addAdditionalEffect(dbType: keyof typeof repositoryMap = "rtdb") {
  const repository = repositoryMap[dbType].additionalEffectsRepository

  return (params: DbEffectData) => repository.setChild({ childKey: params.id }, params)
}
