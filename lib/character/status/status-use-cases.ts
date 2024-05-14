import { getRepository } from "lib/RepositoryBuilder"

import { HealthUpdateState } from "../health/health-reducer"
import { DbLimbsHp } from "../health/health-types"
import { DbStatus } from "./status.types"

function getStatusUseCases(db: keyof typeof getRepository = "rtdb") {
  const repository = getRepository[db].status
  return {
    getElement: (charId: string, field: keyof DbStatus) => repository.get(charId, field),

    get: (charId: string) => repository.getAll(charId),

    updateElement: <T extends keyof DbStatus>(charId: string, field: T, data: DbStatus[T]) =>
      repository.updateElement(charId, field, data),

    groupUpdate: (charId: string, data: Partial<DbStatus>) => {
      const updates = {} as Partial<DbStatus>
      Object.entries(data).forEach(([key, value]) => {
        updates[key as keyof DbStatus] = value
      })
      return repository.groupUpdate(charId, updates)
    },
    groupMod: (charId: string, updateHealthState: HealthUpdateState) => {
      const updates: Partial<DbStatus> = {}
      Object.entries(updateHealthState).forEach(([key, value]) => {
        if (typeof value.count === "number" && typeof value.initValue === "number") {
          updates[key as keyof DbLimbsHp] = value.initValue + value.count
        }
      })
      return repository.groupUpdate(charId, updates)
    },
    updateAll: (charId: string, data: DbStatus) => repository.updateAll(charId, data)
  }
}

export default getStatusUseCases
