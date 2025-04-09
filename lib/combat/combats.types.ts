import { LimbsHp } from "lib/character/health/health-types"

type MovementType = "crawl" | "walk" | "run" | "sprint" | "jump" | "climb" | "getUp"
type ItemActionType = "reload" | "drop" | "equip" | "unequip" | "use" | "search"

type CharId = string
type EnemyId = string
type WeaponId = string
type ItemId = string
type AimZone = "torso" | "legs" | "arms" | "head" | "groin" | "eyes"

type InactiveRecord = Record<number, { inactiveRoundStart: number; inactiveRoundEnd: number }>

type SimpleRoll = {
  actorSkillScore: number
  actorDiceScore: number
  difficultyModifier: number
}
type OppositionRoll = SimpleRoll & {
  opponentSkillScore: number
  opponentDiceScore: number
  opponentArmorClass?: number
}
type Roll = SimpleRoll | OppositionRoll
type HealthChangeEntry = Partial<LimbsHp>
type HealthChangeEntries = Record<CharId, HealthChangeEntry>

type CombatAction = {
  actionCategory: "combat"
  actionName: "attack" | "aim" | "burst"
  actor: CharId
  weaponId: WeaponId
  target: Record<CharId, CharId>
  attackType: "basic" | "aim" | "burst"
  aimZone?: AimZone
  apCost: number
  roll: Roll
  healthChangeEntries?: HealthChangeEntries
}

type MovementAction = {
  actionCategory: "move"
  actionName: MovementType
  actor: CharId
  apCost: number
  roll?: SimpleRoll
  aftermath: { type: MovementAction; distance: number }
  healthChangeEntries?: HealthChangeEntries
}

type ItemAction = {
  actionCategory: "items"
  actionName: { 0: ItemActionType; 1?: ItemActionType }
  itemId: { 0: ItemId; 1?: ItemId }
  actor: CharId
  apCost: number
  roll?: SimpleRoll
  aftermath: {
    0: { action: ItemActionType; itemId: ItemId }
    1?: { action: ItemActionType; itemId: ItemId }
  }
  healthChangeEntries?: HealthChangeEntries
}

type PauseAction = { actionCategory: "pause"; actor: CharId }

export type Action = CombatAction | MovementAction | ItemAction | PauseAction

export type DbCombatEntry = {
  id: string
  squadId: string
  timestamp: string
  location?: string
  title: string
  description?: string
  currActorId: CharId | EnemyId | null
  players: Record<CharId, { initiative: number; inactiveRecord?: InactiveRecord }>
  enemies: Record<EnemyId, { initiative: number; inactiveRecord?: InactiveRecord }>
  rounds: Record<number, Record<number, Action>>
}
