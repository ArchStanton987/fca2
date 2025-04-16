import { DbStatus } from "lib/character/status/status.types"
import repositoryMap from "lib/shared/db/get-repository"

import { PauseAction, PlayerCombatData } from "../combats.types"
import { getActivePlayersWithAp, getIsFightOver, getNextActorId } from "../utils/combat-utils"

type PlayerData = DbStatus & PlayerCombatData & { currMaxAp: number }

export type WaitActionParams = {
  combatId: string
  roundId: number
  actionId: number
  players: Record<string, PlayerData>
  enemies: Record<string, PlayerData>
  action: PauseAction
}

export default function waitAction(dbType: keyof typeof repositoryMap = "rtdb") {
  const combatRepo = repositoryMap[dbType].combatRepository
  const statusRepo = repositoryMap[dbType].statusRepository
  const actionRepo = repositoryMap[dbType].actionRepository
  return (params: WaitActionParams) => {
    const { action, players, enemies, combatId, roundId, actionId } = params
    const charId = action.actorId
    const charType = players[charId] ? "characters" : "enemies"

    const promises = []

    // check if fight is not over
    if (getIsFightOver(params.players, params.enemies)) throw new Error("Fight is over")

    // if no other player has AP, throw error as you can't wait for others
    const activePlayersWithAp = getActivePlayersWithAp(players, enemies)
    if (activePlayersWithAp.length <= 1) throw new Error("No other players with AP")

    // set next actor in combat
    const nextActorId = getNextActorId({ ...players, ...enemies }, charId)
    promises.push(combatRepo.setChild({ id: combatId, childKey: "currActorId" }, nextActorId))

    // set actor new status
    promises.push(statusRepo.setChild({ charId, charType, childKey: "combatStatus" }, "wait"))

    // save action in combat
    promises.push(actionRepo.set({ combatId, roundId, actionId }, action))

    return Promise.all(promises)
  }
}
