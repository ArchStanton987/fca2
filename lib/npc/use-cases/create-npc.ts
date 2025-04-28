import repositoryMap from "lib/shared/db/get-repository"

import { DbNpc } from "../npc.types"

export type CreateNpcParams = DbNpc

export default function createNpc(dbType: keyof typeof repositoryMap = "rtdb") {
  const npcRepo = repositoryMap[dbType].npcRepository

  return (payload: CreateNpcParams) => npcRepo.add({}, payload)
}
