import { LimbsHp } from "lib/character/health/health-types"

type WeaponActionSubtypeId = "basicAttack" | "aim" | "burst" | "reload" | "unload" | "hit" | "throw"
type MovementType = "crawl" | "walk" | "run" | "sprint" | "jump" | "climb" | "getUp"
type ItemActionType = "drop" | "equip" | "unequip" | "use" | "search"

type CharId = string
type EnemyId = string
type WeaponId = string
type ItemId = string
type AimZone = "torso" | "legs" | "arms" | "head" | "groin" | "eyes"

export type SimpleRoll = {
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
export type HealthChangeEntries = Record<CharId, HealthChangeEntry>

type WeaponAction = {
  actionType: "weapon"
  actionSubtype: WeaponActionSubtypeId
  actor: CharId
  weaponId: WeaponId
  target: Record<CharId, CharId>
  attackType: "basic" | "aim" | "burst"
  aimZone?: AimZone
  apCost: number
  roll: Roll
  // aftermath?: { type: MovementAction; distance: number }
  healthChangeEntries?: HealthChangeEntries
}

type MovementAction = {
  actionType: "movement"
  actionSubtype: MovementType
  actor: CharId
  apCost: number
  roll?: SimpleRoll
  // aftermath: { type: MovementType; distance: number }
  healthChangeEntries?: HealthChangeEntries
}

type ItemAction = {
  actionType: "item"
  actionSubtype: { 0: ItemActionType; 1?: ItemActionType }
  itemId: { 0: ItemId; 1?: ItemId }
  actor: CharId
  apCost: number
  roll?: SimpleRoll
  // aftermath: {
  //   0: { action: ItemActionType; itemId: ItemId }
  //   1?: { action: ItemActionType; itemId: ItemId }
  // }
  healthChangeEntries?: HealthChangeEntries
}

type PauseAction = { actionType: "pause"; actor: CharId }

type OtherAction = {
  actionType: "other"
  actionSubtype: string
  actor: CharId
  apCost: number
  roll?: SimpleRoll
  healthChangeEntries?: HealthChangeEntries
}

export type Action = WeaponAction | MovementAction | ItemAction | PauseAction | OtherAction

export type DbCombatEntry = {
  id: string
  squadId: string
  timestamp: string
  location?: string
  title: string
  description?: string
  players: Record<CharId, { initiative: number }>
  enemies: Record<EnemyId, { initiative: number }>
  rounds: Record<number, Record<number, Action>>
}
