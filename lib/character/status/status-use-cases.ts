import { getRepository } from "lib/RepositoryBuilder"
import Character from "lib/character/Character"
import { CreatedElements, defaultCreatedElements } from "lib/objects/created-elements"

import { HealthUpdateState } from "../health/health-reducer"
import { onStatusUpdate } from "./status-utils"
import { UpdatableDbStatus } from "./status.types"

function getStatusUseCases(
  db: keyof typeof getRepository = "rtdb",
  createdElements: CreatedElements = defaultCreatedElements
) {
  const repository = getRepository[db].status
  return {
    getElement: (charId: string, field: keyof UpdatableDbStatus) => repository.get(charId, field),

    get: (charId: string) => repository.getAll(charId),

    updateElement: <T extends keyof UpdatableDbStatus>(
      character: Character,
      field: T,
      data: UpdatableDbStatus[T]
    ) => {
      const newStatus = { ...character.status, [field]: data }
      onStatusUpdate(character, newStatus, createdElements, db)
      return repository.updateElement(character, field, data)
    },
    groupUpdate: (character: Character, data: Partial<UpdatableDbStatus>) => {
      const updates = {} as Partial<UpdatableDbStatus>
      Object.entries(data).forEach(([key, value]) => {
        updates[key as keyof UpdatableDbStatus] = value
      })
      const newStatus = { ...character.status, ...updates }
      onStatusUpdate(character, newStatus, createdElements, db)
      return repository.groupUpdate(character, updates)
    },

    groupMod: (character: Character, updateHealthState: HealthUpdateState) => {
      const updates: Partial<UpdatableDbStatus> = {}
      Object.entries(updateHealthState).forEach(([key, value]) => {
        if (typeof value.count === "number" && typeof value.initValue === "number") {
          updates[key as keyof UpdatableDbStatus] = Math.max(value.initValue + value.count, 0)
        }
      })
      const newStatus = { ...character.status, ...updates }
      onStatusUpdate(character, newStatus, createdElements, db)
      return repository.groupUpdate(character, updates)
    }
  }
}

export default getStatusUseCases
