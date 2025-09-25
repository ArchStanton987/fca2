import { DbType } from "lib/shared/db/db.types"
import repositoryMap from "lib/shared/db/get-repository"

import Effect from "../Effect"

export type RemoveEffectParams = {
  charId: string
  dbKey: Effect["dbKey"]
}

export default function removeEffect(dbType: DbType = "rtdb") {
  const effectsRepo = repositoryMap[dbType].effectsRepository

  return ({ charId, dbKey }: RemoveEffectParams) => effectsRepo.delete({ charId, dbKey })
}
