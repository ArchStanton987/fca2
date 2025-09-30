import { Playable } from "./Playable"
import Abilities from "./abilities/Abilities"
import { CombatStatus } from "./combat-status/combat-status.types"
import Effect from "./effects/Effect"
import { EffectId } from "./effects/effects.types"
import Health from "./health/Health"
import CharInfo from "./info/CharInfo"
import Progress from "./progress/Progress"

type CharacterPayload = {
  info: CharInfo
  combatStatus: CombatStatus
  // combats: Record<string, string>
  abilities: Abilities
  health: Health
  progress: Progress
  effects: Record<EffectId, Effect>
}

export default class Character implements Playable {
  info: CharInfo
  combatStatus: CombatStatus
  // combats: Record<string, string>
  abilities: Abilities
  health: Health
  progress: Progress
  effects: Record<EffectId, Effect>

  constructor(payload: CharacterPayload) {
    this.info = payload.info
    this.combatStatus = payload.combatStatus
    // this.combats = payload.combats
    this.abilities = payload.abilities
    this.health = payload.health
    this.progress = payload.progress
    this.effects = payload.effects
  }
}
