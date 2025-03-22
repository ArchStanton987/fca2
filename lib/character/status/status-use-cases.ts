import { getRepository } from "lib/RepositoryBuilder"
import Character from "lib/character/Character"
import { CreatedElements, defaultCreatedElements } from "lib/objects/created-elements"
import repositoryMap from "lib/shared/db/get-repository"

import { onStatusUpdate } from "./status-utils"
import { UpdatableDbStatus } from "./status.types"

function getStatusUseCases(
  db: keyof typeof getRepository = "rtdb",
  createdElements: CreatedElements = defaultCreatedElements
) {
  const repository = getRepository[db].status

  const statusRepo = repositoryMap[db].statusRepository
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
    groupUpdate: (character: Character, data: Partial<UpdatableDbStatus>) =>
      statusRepo.setChildren({ id: character.charId }, data)
  }
}

export default getStatusUseCases
