import { DbChar } from "lib/character/Character"
import { EffectId } from "lib/character/effects/effects.types"
import { Modifier } from "lib/character/effects/symptoms.type"
import { DbStatus } from "lib/character/status/status.types"
import { WeaponId } from "lib/objects/data/weapons/weapons.types"

export type DbEnemy = DbChar | ((BeastCharacteristics & { status: DbStatus }) & Common)

export type BeastAttack = {
  name: string
  weaponId?: WeaponId
  skill: number // percentage
  apCost: number
  damage: string // dice roll string (e.g., '1d6', '2d4+2')
  effects?: EffectId[]
  modifiers?: Modifier[]
}

type Common = {
  templateId: string
  id: string
  combats?: Record<string, string>
  description?: string
}

export type BeastCharacteristics = {
  templateId: string
  label: string
  hp: number // Health Points
  actionPoints: number // Action Points
  mentalStrength: number // Moral Strength
  critChance: number // Critical Chance (percentage)
  armorClass: number // Armor Class
  resistances: {
    physicalDamageResist: number
    laserDamageResist: number
    fireDamageResist: number
    plasmaDamageResist: number
    poisResist: number
    radsResist: number
  }
  attacks: BeastAttack[]
}
