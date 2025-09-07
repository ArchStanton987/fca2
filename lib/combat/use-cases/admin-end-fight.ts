import { ThenableReference } from "firebase/database"
import { CombatStatus, DbCombatStatus } from "lib/character/combat-status/combat-status.types"
import repositoryMap from "lib/shared/db/get-repository"

export type AdminEndFightParams = {
  shouldDeleteNpcs?: boolean
  combatId: string
  contenders: Record<string, { combatStatus: CombatStatus; maxAp: number }>
}

export default function adminEndFight(dbType: keyof typeof repositoryMap = "rtdb") {
  const combatStatusRepo = repositoryMap[dbType].combatStatusRepository
  const characterRepo = repositoryMap[dbType].characterRepository

  return ({ combatId, contenders }: AdminEndFightParams) => {
    const promises: (Promise<void> | ThenableReference)[] = []
    Object.entries(contenders).forEach(([charId, contender]) => {
      // reset character ap, currFightId, combatStatus
      if (combatId === contender.combatStatus.combatId) {
        const defaultCombatStatus: DbCombatStatus = { currAp: contender.maxAp }
        promises.push(combatStatusRepo.set({ charId }, defaultCombatStatus))
      }
      // add fight ID in characters combat archive
      promises.push(
        characterRepo.patchChild({ id: charId, childKey: "combats" }, { [combatId]: combatId })
      )
    })

    // TODO: allow npc deletion
    // TODO: save combat as archived combat

    return Promise.all(promises)
  }
}
