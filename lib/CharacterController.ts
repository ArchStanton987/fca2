import effectsController from "lib/EffectsController"
import { getRepository } from "lib/RepositoryBuilder"
import Character from "lib/character/Character"
import {
  getEffectLengthInH,
  getExpiringEffects,
  getFollowingEffects
} from "lib/character/effects/effects-utils"
import { EffectData } from "lib/character/effects/effects.types"
import { getNewLimbsHp } from "lib/character/health/health-utils"

function characterController(db: keyof typeof getRepository = "rtdb") {
  return {
    onChangeDate: (char: Character, newDate: Date) => {
      const effectsCtrl = effectsController(db)
      const expiringEffects = getExpiringEffects(char, newDate)
      const followingEffects = getFollowingEffects(char, newDate)
      const newLimbsHp = getNewLimbsHp(char, newDate)
      // effectsRepo.groupRemove(char.charId, expiringEffects)
      // effectsRepo.groupAdd(char, followingEffects.map(({ id }) => id))
      effectsCtrl.groupRemove(char, expiringEffects)
      effectsCtrl.groupAdd(char, followingEffects)
    }
  }
}

export default characterController
