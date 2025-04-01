import repositoryMap from "lib/shared/db/get-repository"

import { DbCombatEntry } from "../combats.types"

export type SubFightParams = {
  id: string
  childKey?: keyof DbCombatEntry
}

export default function subFight(dbType: "rtdb" = "rtdb") {
  const combatRepo = repositoryMap[dbType].combatRepository

  return ({ id, childKey }: SubFightParams) => combatRepo.sub({ id, childKey })
}
