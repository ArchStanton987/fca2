import Squad from "lib/character/Squad"
import repositoryMap from "lib/shared/db/get-repository"

import { DbNpc } from "../npc.types"

export type CreateNpcParams = {
  npc: DbNpc
  squad: Squad
}

export default function createNpc(dbType: keyof typeof repositoryMap = "rtdb") {
  const npcRepo = repositoryMap[dbType].npcRepository
  const squadRepo = repositoryMap[dbType].squadRepository

  return async ({ npc, squad }: CreateNpcParams) => {
    const creationRef = await npcRepo.add({}, npc)
    const key = creationRef?.key
    if (!key) throw new Error("Failed to create NPC")
    const prevNpcs = squad.npcRecord
    const newNpcs = { ...prevNpcs, [key]: key }
    return squadRepo.patchChild({ id: squad.squadId, childKey: "npc" }, newNpcs)
  }
}
