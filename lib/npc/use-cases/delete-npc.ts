import { getCombatStatus } from "lib/character/combat-status/combat-status-provider"
import { UseCasesConfig } from "lib/get-use-case.types"
import repositoryMap from "lib/shared/db/get-repository"

export type DeleteNpcParams = {
  npcId: string
  squadId: string
}

export default function deleteNpc(config: UseCasesConfig) {
  const { db, store } = config
  const playableRepo = repositoryMap[db].playableRepository
  const squadRepo = repositoryMap[db].squadRepository

  return async ({ npcId, squadId }: DeleteNpcParams) => {
    const combatStatus = getCombatStatus(store, npcId)
    const isFighting = !!combatStatus.combatId
    if (isFighting) throw new Error("Cannot delete NPC while in combat")

    const promises = [
      playableRepo.delete({ id: npcId }),
      // @ts-ignore => fix can set null
      squadRepo.patchChild({ id: squadId, childKey: "npc" }, { [npcId]: null })
    ]
    return Promise.all(promises)
  }
}
