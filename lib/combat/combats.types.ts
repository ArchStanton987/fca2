import { EffectId } from "lib/character/effects/effects.types"
import { LimbsHp } from "lib/character/health/health-types"

type WeaponActionSubtypeId = "basicAttack" | "aim" | "burst" | "reload" | "unload" | "hit" | "throw"
export type MovementType = "crawl" | "walk" | "run" | "sprint" | "jump" | "climb" | "getUp"
type ItemActionType = "drop" | "equip" | "unequip" | "use" | "search"
export type PrepareActionType = "dangerAwareness" | "visualize"

type CharId = string
type NpcId = string
type ItemId = string
type AimZone = "torso" | "legs" | "arms" | "head" | "groin" | "eyes"

type InactiveRecord = Record<number, { inactiveRoundStart: number; inactiveRoundEnd: number }>
type ArmorClassBonusRecord = Record<number, number>

export type PlayerCombatData = {
  initiative: number
  inactiveRecord?: InactiveRecord
  actionBonus: number
  acBonusRecord: ArmorClassBonusRecord
}

export type SimpleRoll = {
  actorSkillScore?: number
  actorDiceScore?: number
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
  isCombinedAction?: boolean
  apCost?: number
  roll?: Roll | false
  healthChangeEntries?: HealthChangeEntries
  itemId?: ItemId
  targetName?: string
  isDone?: boolean
}

export type WeaponAction = {
  actionType: "weapon"
  actionSubtype: WeaponActionSubtypeId
  actorId: CharId
  isCombinedAction?: boolean
  itemId: ItemId
  targetName: string
  aimZone?: AimZone
  apCost: number
  roll: Roll
  healthChangeEntries?: HealthChangeEntries
  isDone?: boolean
}

export type MovementAction = {
  actionType: "movement"
  actionSubtype: MovementType
  actorId: CharId
  isCombinedAction?: boolean
  apCost: number
  roll?: SimpleRoll | null
  healthChangeEntries?: HealthChangeEntries
  isDone?: boolean
}

export type ItemAction = {
  actionType: "item"
  actionSubtype: ItemActionType
  itemId: ItemId
  actorId: CharId
  isCombinedAction?: boolean
  apCost: number
  roll?: SimpleRoll | null
  healthChangeEntries?: HealthChangeEntries
  isDone?: boolean
}

export type PauseAction = { actionType: "pause"; actorId: CharId; isDone?: boolean }

export type OtherAction = {
  actionType: "other"
  actionSubtype: string
  actorId: CharId
  isCombinedAction?: boolean
  apCost: number
  roll?: SimpleRoll | null
  healthChangeEntries?: HealthChangeEntries
  isDone?: boolean
}

export type PrepareAction = {
  actionType: "prepare"
  actionSubtype: PrepareActionType
  actorId: CharId
  apCost: number
  isDone?: boolean
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
