import { EffectId } from "lib/character/effects/effects.types"
import { LimbsHp } from "lib/character/health/health-types"
import { DbStatus } from "lib/character/status/status.types"

type WeaponActionSubtypeId = "basicAttack" | "aim" | "burst" | "reload" | "unload" | "hit" | "throw"
type MovementType = "crawl" | "walk" | "run" | "sprint" | "jump" | "climb" | "getUp"
type ItemActionType = "drop" | "equip" | "unequip" | "use" | "search"
type PrepareActionType = "dangerAwareness" | "visualize"

type CharId = string
type EnemyId = string
type WeaponId = string
type ItemId = string
type AimZone = "torso" | "legs" | "arms" | "head" | "groin" | "eyes"

type InactiveRecord = Record<number, { inactiveRoundStart: number; inactiveRoundEnd: number }>

export type PlayerCombatData = {
  initiative: number
  inactiveRecord?: InactiveRecord
  nextActionBonus: number
}

export type PlayerData = DbStatus & PlayerCombatData & { currMaxAp: number }

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

export type WeaponAction = {
  actionType: "weapon"
  actionSubtype: WeaponActionSubtypeId
  actorId: CharId
  weaponId: WeaponId
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

export type Action =
  | WeaponAction
  | MovementAction
  | ItemAction
  | PauseAction
  | OtherAction
  | PrepareAction

export type DbCombatEntry = {
  id: string
  squadId: string
  timestamp: string
  location?: string
  title: string
  description?: string
  currActorId: string
  players: Record<CharId, PlayerCombatData>
  enemies: Record<EnemyId, PlayerCombatData>
  rounds: Record<number, Record<number, Action>>
}
