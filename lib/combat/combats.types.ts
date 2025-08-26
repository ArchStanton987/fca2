import { EffectId } from "lib/character/effects/effects.types"
import { LimbsHp } from "lib/character/health/health-types"
import { DamageTypeId } from "lib/objects/data/weapons/weapons.types"

type CharId = string
type NpcId = string
type ItemId = string
type AimZone = keyof LimbsHp
type RoundId = number
type AcBonus = number

type InactiveRecord = Record<number, { inactiveRoundStart: number; inactiveRoundEnd: number }>
type ArmorClassBonusRecord = Record<RoundId, AcBonus>

export type PlayerCombatData = {
  initiative: number
  inactiveRecord?: InactiveRecord
  actionBonus: number
  acBonusRecord: ArmorClassBonusRecord
}

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
type HpEntry = {
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
type RadEntry = {
  charId: string
  entryType: "rads"
  amount: number
}
type EffectEntry = {
  charId: string
  entryType: "effect"
  effectId: EffectId
}
export type DamageEntry = HpEntry | InactiveEntry | RadEntry | EffectEntry
export type DamageEntries = Record<string, DamageEntry> | false

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

export type DbCombatEntry = {
  squadId: string
  date: string
  location?: string
  title: string
  description?: string
  currActorId: string
  players: Record<CharId, PlayerCombatData>
  npcs: Record<NpcId, PlayerCombatData>
  rounds?: Record<number, Record<number, DbAction>>
}
