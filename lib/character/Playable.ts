import { AmmoSet } from "lib/objects/data/ammo/ammo.types"
import { DbItem } from "lib/objects/data/objects.types"

import Abilities from "./abilities/Abilities"
import { DbAbilities } from "./abilities/abilities.types"
import { CombatStatus, DbCombatStatus } from "./combat-status/combat-status.types"
import Effect from "./effects/Effect"
import { EffectId } from "./effects/effects.types"
import Health, { DbHealth } from "./health/Health"
import CharInfo, { DbCharInfo } from "./info/CharInfo"
import Progress from "./progress/Progress"

export type PlayingCharacterSpecies = "human" | "ghoul" | "mutie" | "half-mutie" | "deathclaw"
export type CritterSpecies = "robot" | "beast"
export type Species = CritterSpecies | PlayingCharacterSpecies

export type DbPlayable = {
  info: DbCharInfo
  abilities: DbAbilities
  combatStatus: DbCombatStatus
  combats?: Record<string, string>
  exp: number
  health: DbHealth
  effects?: Record<EffectId, Effect>
  inventory: {
    caps: number
    items?: Record<string, DbItem>
    ammo?: Partial<AmmoSet>
  }
}

export interface Playable {
  info: CharInfo
  combatStatus: CombatStatus
  combats: Record<string, string>
  abilities: Abilities
  health: Health
  progress: Progress
  effects: Record<EffectId, Effect>
}
