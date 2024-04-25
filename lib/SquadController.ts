import { getRepository } from "lib/RepositoryBuilder"

function squadController(db: keyof typeof getRepository = "rtdb") {
  const repository = getRepository[db].squads

  return {
    get: (squadId: string) => repository.get(squadId),

    getAll: () => repository.getAll(),

    updateDate: (squadId: string, date: Date) =>
      repository.updateElement(squadId, "datetime", date.toJSON())
  }
}

export default squadController
