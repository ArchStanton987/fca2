import { DbCombatEntry } from "lib/combat/combats.types"
import repositoryMap from "lib/shared/db/get-repository"

export default function createFight(dbType: keyof typeof repositoryMap = "rtdb") {
  const combatRepo = repositoryMap[dbType].combatRepository
  const charRepo = repositoryMap[dbType].characterRepository
  const enemyRepo = repositoryMap[dbType].enemyRepository

  return (params: DbCombatEntry) => {
    const combatId = params.id
    const promises = []
    const playersIds = Object.keys(params.players ?? {})
    const enemiesIds = Object.keys(params.enemies ?? {})

    playersIds.forEach(id =>
      promises.push(charRepo.add({ id, childKey: "combats" }, { [combatId]: combatId }))
    )
    enemiesIds.forEach(id =>
      promises.push(enemyRepo.add({ id, childKey: "combats" }, { [combatId]: combatId }))
    )

    promises.push(combatRepo.add({ id: combatId }, params))

    return Promise.all(promises)
  }
}
