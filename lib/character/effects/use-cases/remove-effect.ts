import { UseCasesConfig } from "lib/get-use-case.types"
import repositoryMap from "lib/shared/db/get-repository"

import Effect from "../Effect"

export type RemoveEffectParams = {
  charId: string
  dbKey: Effect["dbKey"]
}

export default function removeEffect({ db }: UseCasesConfig) {
  const effectsRepo = repositoryMap[db].effectsRepository

  return ({ charId, dbKey }: RemoveEffectParams) => effectsRepo.delete({ charId, dbKey })
}
