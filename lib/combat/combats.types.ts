import { EffectId } from "lib/character/effects/effects.types"
import { LimbsHp } from "lib/character/health/health-types"

type WeaponActionSubtypeId = "basicAttack" | "aim" | "burst" | "reload" | "unload" | "hit" | "throw"
type MovementType = "crawl" | "walk" | "run" | "sprint" | "jump" | "climb" | "getUp"
type ItemActionType = "drop" | "equip" | "unequip" | "use" | "search"

type CharId = string
type EnemyId = string
type WeaponId = string
type ItemId = string
type AimZone = "torso" | "legs" | "arms" | "head" | "groin" | "eyes"

type InactiveRecord = Record<number, { inactiveRoundStart: number; inactiveRoundEnd: number }>

type PlayerCombatData = {
  initiative: number
  inactiveRecord?: InactiveRecord
  nextActionBonus: number
}

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
export type HealthChangeEntry = {
  status: Partial<LimbsHp>
  newEffects: { id: EffectId; duration: number }[]
}
export type HealthChangeEntries = Record<CharId, HealthChangeEntry>

type WeaponAction = {
  actionType: "weapon"
  actionSubtype: WeaponActionSubtypeId
  actor: CharId
  weaponId: WeaponId
  target: Record<CharId, CharId>
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
  actionSubtype: ItemActionType
  itemId: ItemId
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
  currActorId: string
  players: Record<CharId, PlayerCombatData>
  enemies: Record<EnemyId, PlayerCombatData>
  rounds: Record<number, Record<number, Action>>
}
