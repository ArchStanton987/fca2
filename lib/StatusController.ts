import { getRepository } from "lib/RepositoryBuilder"
import { DbStatus } from "lib/character/status/status.types"

function statusController(db: keyof typeof getRepository = "rtdb") {
  const repository = getRepository[db].status
  return {
    get: (charId: string, field: keyof DbStatus) => repository.get(charId, field),
    getAll: (charId: string) => repository.getAll(charId),
    updateElement: (charId: string, field: keyof DbStatus, data: string | number) =>
      repository.updateElement(charId, field, data),
    updateElements: (charId: string, updates: Partial<DbStatus>) =>
      repository.groupUpdate(charId, updates),
    updateAll: (charId: string, data: DbStatus) => repository.updateAll(charId, data)
  }
}

export default statusController
