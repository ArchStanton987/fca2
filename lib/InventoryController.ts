import { getRepository } from "./RepositoryBuilder"
import { ExchangeState } from "./objects/objects-reducer"

const inventoryController = (db: keyof typeof getRepository = "rtdb") => {
  const repository = getRepository[db].inventory

  return {
    getAll: (charId: string) => repository.getAll(charId),
    groupAdd: (charId: string, payload: ExchangeState) => repository.groupAdd(charId, payload)
  }
}

export default inventoryController
