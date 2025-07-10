import { LimbsHp } from "lib/character/health/health-types"
import { DamageTypeId } from "lib/objects/data/weapons/weapons.types"

type WeaponActionSubtypeId = "basicAttack" | "aim" | "burst" | "reload" | "unload" | "hit" | "throw"
export type MovementType = "crawl" | "walk" | "run" | "sprint" | "jump" | "climb" | "getUp"
type ItemActionType = "drop" | "equip" | "unequip" | "use" | "search"
export type PrepareActionType = "dangerAwareness" | "visualize"

type CharId = string
type NpcId = string
type ItemId = string
type AimZone = keyof LimbsHp

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
type OppositionRoll = {
  opponentId: string
  opponentSkillScore: number
  opponentDiceScore: number
  opponentArmorClass?: number
  opponentApCost: number
}
export type Roll = SimpleRoll | OppositionRoll
type DamageEntry = {
  charId: string
  entryType: "hp"
  localization: keyof LimbsHp
  damage: number
}
type InactiveEntry = {
  charId: string
  entryType: "inactive"
  duration: number
}
export type GMDamageEntry = DamageEntry | InactiveEntry
export type DamageEntries = Record<string, GMDamageEntry> | false

export type Action = {
  actionType: string
  actionSubtype?: string
  actorId: CharId
  isCombinedAction?: boolean
  apCost?: number
  roll?: SimpleRoll | false
  oppositionRoll?: OppositionRoll | false
  healthChangeEntries?: DamageEntries | false
  itemId?: ItemId
  itemDbKey?: string
  targetId?: string
  damageLocalization?: keyof LimbsHp
  aimZone?: AimZone
  rawDamage?: number
  damageType?: DamageTypeId
  isDone?: boolean
}

export type WeaponAction = {
  actionType: "weapon"
  actionSubtype: WeaponActionSubtypeId
  actorId: CharId
  isCombinedAction?: boolean
  itemId: ItemId
  itemDbKey?: string
  targetId: string
  damageLocalization?: keyof LimbsHp
  aimZone?: AimZone
  rawDamage?: number
  damageType?: DamageTypeId
  apCost: number
  roll: Roll
  healthChangeEntries?: DamageEntries
  isDone?: boolean
}

export type MovementAction = {
  actionType: "movement"
  actionSubtype: MovementType
  actorId: CharId
  isCombinedAction?: boolean
  apCost: number
  roll?: SimpleRoll | null
  healthChangeEntries?: DamageEntries
  isDone?: boolean
}

export type ItemAction = {
  actionType: "item"
  actionSubtype: ItemActionType
  actorId: CharId
  itemId: ItemId
  itemDbKey: string
  targetId: string
  damageLocalization?: keyof LimbsHp
  rawDamage?: number
  damageType?: DamageTypeId
  isCombinedAction?: boolean
  apCost: number
  roll?: SimpleRoll | null
  healthChangeEntries?: DamageEntries
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
  healthChangeEntries?: DamageEntries
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
