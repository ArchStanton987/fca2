import { DbPlayable } from "lib/character/Playable"
import { UseCasesConfig } from "lib/get-use-case.types"
import repositoryMap from "lib/shared/db/get-repository"
import { getSquad } from "lib/squad/use-cases/sub-squad"

export type CreateNpcParams = {
  npc: DbPlayable
  squadId: string
}

export default function createNpc({ db, store }: UseCasesConfig) {
  const playableRepo = repositoryMap[db].playableRepository
  const squadRepo = repositoryMap[db].squadRepository

  return async ({ npc, squadId }: CreateNpcParams) => {
    const creationRef = await playableRepo.add({}, { ...npc, inventory: { caps: 0 } })
    const key = creationRef?.key
    if (!key) throw new Error("Failed to create NPC")
    const squad = getSquad(store, squadId)
    const prevNpcs = squad.npcs
    const newNpcs = { ...prevNpcs, [key]: key }
    return squadRepo.patchChild({ id: squadId, childKey: "npc" }, newNpcs)
  }
}
