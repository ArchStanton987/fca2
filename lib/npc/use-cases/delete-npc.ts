import Squad from "lib/character/Squad"
import { CombatStatus } from "lib/character/combat-status/combat-status.types"
import { UseCaseConfig } from "lib/get-use-cases"
import repositoryMap from "lib/shared/db/get-repository"

export type DeleteNpcParams = {
  npcId: string
  npcCombatStatus: CombatStatus
  squad: Squad
}

export default function deleteNpc({ db }: UseCaseConfig) {
  const playableRepo = repositoryMap[db].playableRepository
  const squadRepo = repositoryMap[db].squadRepository

  return async ({ npcId, npcCombatStatus, squad }: DeleteNpcParams) => {
    const isFighting = !!npcCombatStatus.combatId
    if (isFighting) throw new Error("Cannot delete NPC while in combat")

    const newSquad = { ...squad.dbSquad }
    delete newSquad.npc[npcId]
    const promises = [
      playableRepo.delete({ id: npcId }),
      squadRepo.patch({ id: squad.squadId }, newSquad)
    ]
    return Promise.all(promises)
  }
}
