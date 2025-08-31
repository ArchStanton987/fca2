import Playable from "lib/character/Playable"
import Squad from "lib/character/Squad"
import repositoryMap from "lib/shared/db/get-repository"

export type DeleteNpcParams = {
  playable: Playable
  squad: Squad
}

export default function deleteNpc(dbType: keyof typeof repositoryMap = "rtdb") {
  const npcRepo = repositoryMap[dbType].npcRepository
  const squadRepo = repositoryMap[dbType].squadRepository

  return async ({ playable, squad }: DeleteNpcParams) => {
    const isFighting = !!playable.status.currentCombatId
    if (isFighting) throw new Error("Cannot delete NPC while in combat")

    const newSquad = { ...squad.dbSquad }
    delete newSquad.npc[playable.charId]
    const promises = [
      npcRepo.delete({ id: playable.charId }),
      squadRepo.patch({ id: squad.squadId }, newSquad)
    ]
    return Promise.all(promises)
  }
}
