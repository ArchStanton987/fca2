import repositoryMap from "lib/shared/db/get-repository"

export type StartFightParams = {
  combatId: string
  players: Record<string, { currMaxAp: number }>
  npcs: Record<string, { currMaxAp: number }>
}

export default function startFight(dbType: keyof typeof repositoryMap = "rtdb") {
  const statusRepo = repositoryMap[dbType].statusRepository

  return async ({ combatId, players, npcs }: StartFightParams) => {
    const promises: Promise<void>[] = []
    const combatStatus = { combatStatus: "active" as const, currentCombatId: combatId }
    Object.entries({ players, npcs }).forEach(([type, contenders]) => {
      Object.entries(contenders).forEach(([charId, { currMaxAp }]) => {
        const charType = type === "players" ? ("characters" as const) : ("npcs" as const)
        const patchedStatus = { ...combatStatus, currAp: currMaxAp }
        promises.push(statusRepo.patch({ charId, charType }, patchedStatus))
      })
    })
    return Promise.all(promises)
  }
}
