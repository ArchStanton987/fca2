import { getSecAttr, getTraits } from "lib/character/abilities/abilities-provider"
import { getEffects } from "lib/character/effects/effects-provider"
import { getExpiringEffects, getFollowingEffects } from "lib/character/effects/effects-utils"
import addEffect from "lib/character/effects/use-cases/add-effect"
import removeEffect from "lib/character/effects/use-cases/remove-effect"
import Health from "lib/character/health/Health"
import updateHealth from "lib/character/health/use-cases/update-health"
import { UseCasesConfig } from "lib/get-use-case.types"
import repositoryMap from "lib/shared/db/get-repository"

import { getDatetime, getSquadPlayables } from "./sub-squad"

export type UpdateDateParams = {
  squadId: string
  newDate: Date
}

export default function updateDate(config: UseCasesConfig) {
  const { db, collectiblesData, store } = config
  const allEffects = collectiblesData.effects

  const squadRepo = repositoryMap[db].squadRepository

  return async ({ newDate, squadId }: UpdateDateParams) => {
    const promises = []
    const currDate = getDatetime(store, squadId)
    const playables = getSquadPlayables(store, squadId)

    Object.keys(playables).forEach(charId => {
      const traits = getTraits(store, charId)
      const effects = getEffects(store, charId)

      const expiringEffects = getExpiringEffects(effects, traits, newDate)
      expiringEffects.forEach(expiredEffect => {
        promises.push(removeEffect(config)({ charId, dbKey: expiredEffect.dbKey }))
      })

      const followingEffects = getFollowingEffects(effects, traits, newDate, allEffects)
      followingEffects.forEach(({ effectId, startDate }) => {
        promises.push(addEffect(config)({ effectId, charId, startDate }))
      })

      const secAttr = getSecAttr(store, charId)
      let hpDiff = Health.getHpDiffOnTimePass(currDate, newDate, secAttr.curr.healHpPerHour)

      const hasPoison = Object.values(effects).some(e => e.type === "poison")

      // damage to be taken with poison resistance
      if (hpDiff < 0 && hasPoison) {
        const poisonDamageMultiplier = 1 - secAttr.curr.poisResist / 100
        hpDiff *= poisonDamageMultiplier
      }

      if (hpDiff !== 0) {
        const payload = { rads: 0, limbs: {}, currHp: hpDiff }
        promises.push(updateHealth(config)({ charId, payload }))
      }
    })
    promises.push(squadRepo.setChild({ id: squadId, childKey: "datetime" }, newDate.toJSON()))
    return promises
  }
}
