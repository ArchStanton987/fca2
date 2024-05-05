import { getRepository } from "lib/RepositoryBuilder"

import { DbStatus } from "./status.types"

function getStatusUseCases(db: keyof typeof getRepository = "rtdb") {
  const repository = getRepository[db].status
  return {
    getElement: (charId: string, field: keyof DbStatus) => repository.get(charId, field),

    get: (charId: string) => repository.getAll(charId),

    updateElement: <T extends keyof DbStatus>(charId: string, field: T, data: DbStatus[T]) =>
      repository.updateElement(charId, field, data),

    groupUpdate: (charId: string, updates: Partial<DbStatus>) =>
      repository.groupUpdate(charId, updates),

    updateAll: (charId: string, data: DbStatus) => repository.updateAll(charId, data)
  }
}

export default getStatusUseCases
