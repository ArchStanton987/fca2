import { getRepository } from "lib/RepositoryBuilder"
import Character from "lib/character/Character"

import { HealthUpdateState } from "../health/health-reducer"
import { onStatusUpdate } from "./status-utils"
import { DbStatus } from "./status.types"

function getStatusUseCases(db: keyof typeof getRepository = "rtdb") {
  const repository = getRepository[db].status
  return {
    getElement: (charId: string, field: keyof DbStatus) => repository.get(charId, field),

    get: (charId: string) => repository.getAll(charId),

    updateElement: <T extends keyof DbStatus>(
      character: Character,
      field: T,
      data: DbStatus[T]
    ) => {
      const newStatus = { ...character.status, [field]: data }
      onStatusUpdate(character, newStatus, db)
      return repository.updateElement(character.charId, field, data)
    },
    groupUpdate: (character: Character, data: Partial<DbStatus>) => {
      const updates = {} as Partial<DbStatus>
      Object.entries(data).forEach(([key, value]) => {
        updates[key as keyof DbStatus] = value
      })
      const newStatus = { ...character.status, ...updates }
      onStatusUpdate(character, newStatus, db)
      return repository.groupUpdate(character.charId, updates)
    },

    groupMod: (character: Character, updateHealthState: HealthUpdateState) => {
      const updates: Partial<DbStatus> = {}
      Object.entries(updateHealthState).forEach(([key, value]) => {
        if (typeof value.count === "number" && typeof value.initValue === "number") {
          updates[key as keyof DbStatus] = Math.max(value.initValue + value.count, 0)
        }
      })
      const newStatus = { ...character.status, ...updates }
      onStatusUpdate(character, newStatus, db)
      return repository.groupUpdate(character.charId, updates)
    },

    updateAll: (charId: string, data: DbStatus) => repository.updateAll(charId, data)
  }
}

export default getStatusUseCases
