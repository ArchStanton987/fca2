import Playable from "lib/character/Playable"
import repositoryMap from "lib/shared/db/get-repository"

import { PlayerCombatData } from "../combats.types"
import { DEFAULT_INITIATIVE } from "../const/combat-const"
import startFight from "./start-fight"

export type CreateFightParams = {
  squadId: string
  date: string
  location?: string
  title: string
  description?: string
  contenders: Record<string, Playable>
  isStartingNow: boolean
}

const defaultContenderData = {
  initiative: DEFAULT_INITIATIVE,
  actionBonus: 0,
  acBonusRecord: { 1: 0 }
}

export default function createFight(dbType: keyof typeof repositoryMap = "rtdb") {
  const combatRepo = repositoryMap[dbType].combatRepository

  return async ({ contenders, isStartingNow, ...rest }: CreateFightParams) => {
    const players: Record<string, PlayerCombatData> = {}
    const npcs: Record<string, PlayerCombatData> = {}
    Object.entries(contenders).forEach(([id, contender]) => {
      const { isNpc } = contender.meta
      if (isNpc) {
        npcs[id] = { ...defaultContenderData }
      } else {
        players[id] = { ...defaultContenderData }
      }
    })
    const payload = { ...rest, currActorId: "", players, npcs, rounds: {} }
    const creationRef = await combatRepo.add({}, payload)
    const combatId = creationRef?.key
    if (!combatId) throw new Error("Failed to create combat")
    if (isStartingNow) {
      await startFight(dbType)({ combatId, contenders })
    }
    return combatId
  }
}
