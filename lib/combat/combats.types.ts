import Playable from "lib/character/Playable"
import { EffectId } from "lib/character/effects/effects.types"
import { LimbsHp } from "lib/character/health/health-types"

type WeaponActionSubtypeId = "basicAttack" | "aim" | "burst" | "reload" | "unload" | "hit" | "throw"
type MovementType = "crawl" | "walk" | "run" | "sprint" | "jump" | "climb" | "getUp"
type ItemActionType = "drop" | "equip" | "unequip" | "use" | "search"
type PrepareActionType = "dangerAwareness" | "visualize"

type CharId = string
type NpcId = string
type ItemId = string
type AimZone = "torso" | "legs" | "arms" | "head" | "groin" | "eyes"

type InactiveRecord = Record<number, { inactiveRoundStart: number; inactiveRoundEnd: number }>

export type PlayerCombatData = {
  initiative: number
  inactiveRecord?: InactiveRecord
  nextActionBonus: number
}

export type PlayerData = {
  char: Playable
  combatData: PlayerCombatData
}

export type SimpleRoll = {
  actorSkillScore: number
  actorDiceScore: number
  difficultyModifier: number
}
type OppositionRoll = SimpleRoll & {
  opponentId: string
  opponentSkillScore: number
  opponentDiceScore: number
  opponentArmorClass?: number
  opponentApCost: number
}
export type Roll = SimpleRoll | OppositionRoll
export type HealthChangeEntry = {
  status: Partial<LimbsHp>
  newEffects: { id: EffectId; duration: number }[]
}
export type HealthChangeEntries = Record<CharId, HealthChangeEntry>

export type Action = {
  actionType: string
  actionSubtype?: string
  actorId: CharId
  apCost?: number
  roll?: Roll
  healthChangeEntries?: HealthChangeEntries
  itemId?: ItemId
  targetName?: string
}

export type WeaponAction = {
  actionType: "weapon"
  actionSubtype: WeaponActionSubtypeId
  actorId: CharId
  itemId: ItemId
  targetName: string
  aimZone?: AimZone
  apCost: number
  roll: Roll
  healthChangeEntries?: HealthChangeEntries
}

export type MovementAction = {
  actionType: "movement"
  actionSubtype: MovementType
  actorId: CharId
  apCost: number
  roll?: SimpleRoll
  healthChangeEntries?: HealthChangeEntries
}

export type ItemAction = {
  actionType: "item"
  actionSubtype: ItemActionType
  itemId: ItemId
  actorId: CharId
  apCost: number
  roll?: SimpleRoll
  healthChangeEntries?: HealthChangeEntries
}

export type PauseAction = { actionType: "pause"; actorId: CharId }

export type OtherAction = {
  actionType: "other"
  actionSubtype: string
  actorId: CharId
  apCost: number
  roll?: SimpleRoll
  healthChangeEntries?: HealthChangeEntries
}

export type PrepareAction = {
  actionType: "prepare"
  actionSubtype: PrepareActionType
  actorId: CharId
  apCost: number
}

export type DoneAction =
  | WeaponAction
  | MovementAction
  | ItemAction
  | PauseAction
  | OtherAction
  | PrepareAction

export type DbCombatEntry = {
  squadId: string
  date: string
  location?: string
  title: string
  description?: string
  currActorId: string
  players: Record<CharId, PlayerCombatData>
  npcs: Record<NpcId, PlayerCombatData>
  rounds?: Record<number, Record<number, Action>>
}

// export type DbArchivedCombat = {
//   squadId: string
//   timestamp: string
//   location?: string
//   title: string
//   description?: string
//   rounds?: Record<number, Record<number, DoneAction>>
// }

// export type DbCombatEntry = DbActiveCombat | DbArchivedCombat

export type DbPlayableCombatRecap = {
  id: string
  title: string
  date: string
  location?: string
  description?: string
}
