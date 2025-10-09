import { DbPlayable } from "lib/character/Playable"
import Squad from "lib/character/Squad"
import { UseCasesConfig } from "lib/get-use-case.types"
import repositoryMap from "lib/shared/db/get-repository"

export type CreateNpcParams = {
  npc: DbPlayable
  squad: Squad
  squadId: string
}

export default function createNpc({ db }: UseCasesConfig) {
  const playableRepo = repositoryMap[db].playableRepository
  const squadRepo = repositoryMap[db].squadRepository

  return async ({ npc, squad, squadId }: CreateNpcParams) => {
    const creationRef = await playableRepo.add({}, { ...npc, inventory: { caps: 0 } })
    const key = creationRef?.key
    if (!key) throw new Error("Failed to create NPC")
    const prevNpcs = squad.npcs
    const newNpcs = { ...prevNpcs, [key]: key }
    return squadRepo.patchChild({ id: squadId, childKey: "npc" }, newNpcs)
  }
}
