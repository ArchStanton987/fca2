import { SkillId } from "lib/character/abilities/skills/skills.types"
import { BeastAttack } from "lib/objects/data/weapons/weapons.types"

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
  skills: Partial<Record<SkillId, number>>
}
