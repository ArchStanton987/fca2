import { getRepository } from "lib/RepositoryBuilder"
import { CreatedElements, defaultCreatedElements } from "lib/objects/created-elements"
import { CharType } from "lib/shared/db/api-rtdb"
import repositoryMap from "lib/shared/db/get-repository"

import Playable from "../Playable"
import { onStatusUpdate } from "./status-utils"
import { UpdatableDbStatus } from "./status.types"

function getStatusUseCases(
  db: keyof typeof getRepository = "rtdb",
  createdElements: CreatedElements = defaultCreatedElements
) {
  const repository = getRepository[db].status

  const statusRepo = repositoryMap[db].statusRepository
  return {
    getElement: (charType: CharType, charId: string, field: keyof UpdatableDbStatus) =>
      repository.get(charType, charId, field),

    get: (charType: CharType, charId: string) => repository.getAll(charType, charId),

    updateElement: <T extends keyof UpdatableDbStatus>(
      character: Playable,
      field: T,
      data: UpdatableDbStatus[T]
    ) => {
      const newStatus = { ...character.status, [field]: data }
      onStatusUpdate(character, newStatus, createdElements, db)
      return repository.updateElement(character, field, data)
    },
    groupUpdate: (
      character: Playable,
      data: Partial<UpdatableDbStatus>,
      charType: "npcs" | "characters"
    ) => statusRepo.patch({ charId: character.charId, charType }, data)
  }
}

export default getStatusUseCases
