import { DbChar } from "lib/character/Character"
import { BeastAttack } from "lib/objects/data/weapons/weapons.types"

export type DbNonHumanNpc = Pick<DbChar, "meta" | "status" | "combats" | "combatStatus">
export type DbNpc = DbChar | DbNonHumanNpc

export type NpcType = "human" | "robot" | "animal"

export type NonHumanNpcTemplate = {
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
