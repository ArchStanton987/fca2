import Playable from "lib/character/Playable"
import repositoryMap from "lib/shared/db/get-repository"

export type StartFightParams = {
  combatId: string
  contenders: Record<string, Playable>
}

export default function startFight(dbType: keyof typeof repositoryMap = "rtdb") {
  const statusRepo = repositoryMap[dbType].statusRepository

  return async ({ combatId, contenders }: StartFightParams) => {
    const promises: Promise<void>[] = []
    const combatStatus = { combatStatus: "active" as const, currentCombatId: combatId }

    Object.entries(contenders).forEach(([charId, playable]) => {
      const currMaxAp = playable.secAttr.curr.actionPoints
      const patchedStatus = { ...combatStatus, currAp: currMaxAp }
      const charType = playable.meta.isNpc ? "npcs" : "characters"
      promises.push(statusRepo.patch({ charId, charType }, patchedStatus))
    })

    return Promise.all(promises)
  }
}
