import { EffectId } from "lib/character/effects/effects.types"
import { LimbsHp } from "lib/character/health/health-types"
import { DamageTypeId } from "lib/objects/data/weapons/weapons.types"

type CharId = string
// type NpcId = string
type PlayableId = string
type ItemId = string
type AimZone = keyof LimbsHp

export type Roll = {
  sumAbilities: number
  dice: number
  bonus: number
  difficulty: number
  targetArmorClass: number
}
export type ReactionRoll = {
  opponentId: string
  opponentSumAbilities: number
  opponentDice: number
  opponentApCost: number
}
export interface DamageEntry {
  charId: string
  entryType: "hp" | "rads" | "effect" | "inactive"
  localization?: keyof LimbsHp
  damage?: number
  duration?: number
  amount?: number
  effectId?: EffectId | ""
}
export type DamageEntries = Record<number, DamageEntry> | false

export type DbAction = {
  actionType?: string
  actionSubtype?: string
  actorId?: CharId
  isCombinedAction?: boolean
  apCost?: number
  isSuccess?: boolean
  isDone?: boolean
  roll?: Roll | false
  reactionRoll?: ReactionRoll | false
  healthChangeEntries?: DamageEntries | false
  itemId?: ItemId | false
  itemDbKey?: string | false
  targetId?: string | false
  damageLocalization?: keyof LimbsHp | false
  aimZone?: AimZone | false
  rawDamage?: number | false
  damageType?: DamageTypeId | false
}

// export type DbCombatEntry = {
//   squadId: string
//   date: string
//   location?: string
//   title: string
//   description?: string
//   currActorId: string
//   players: Record<CharId, CharId>
//   npcs: Record<NpcId, NpcId>
//   rounds?: Record<number, Record<number, DbAction>>
// }

export interface DbCombat {
  info: {
    date: string // ISO string
    location?: string
    title: string
    description?: string
    contenders: Record<PlayableId, PlayableId>
  }
  history: Record<number, Record<number, DbAction>>
  state: {
    action: DbAction
    actorIdOverride: string
  }
}

export type DbCombatInfo = DbCombat["info"]

export type DbCombatHistory = DbCombat["history"]

export type DbCombatState = DbCombat["state"]
