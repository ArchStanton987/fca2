import repositoryMap from "lib/shared/db/get-repository"

export default function subAllFights(dbType: "rtdb" = "rtdb") {
  const combatRepo = repositoryMap[dbType].combatRepository

  return () => combatRepo.subAll({})
}
