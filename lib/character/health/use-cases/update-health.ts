import { getExp } from "lib/character/progress/exp-provider"
import { getLevelAndThresholds } from "lib/character/status/status-calc"
import { UseCasesConfig } from "lib/get-use-case.types"

import { getHealth } from "../health-provider"
import { UpdateHealthStore } from "../update-health-store"
import updateCurrHp from "./update-curr-hp"
import updateLimbsHp from "./update-limbs-hp"
import updateRads from "./update-rads"

export type UpdateHealthParams = {
  charId: string
  payload: Pick<UpdateHealthStore, "currHp" | "limbs" | "rads">
}

export default function updateHealth(config: UseCasesConfig) {
  const { store } = config

  return ({ charId, payload }: UpdateHealthParams) => {
    const { currHp, rads, limbs } = payload

    const promises = []

    // limbs & currhp are modified => throw error
    if (currHp !== 0 && Object.keys(limbs).length > 0)
      throw new Error("currHp & limbs should not be modified at the same time")

    if (currHp !== 0) {
      const health = getHealth(store, charId)
      const exp = getExp(store, charId)
      const { level } = getLevelAndThresholds(exp)
      const newLimbsHp = health.getNewLimbsHpFromHpDiff(currHp, level)

      promises.push(
        updateLimbsHp(config)({ charId, newLimbsHp }),
        updateCurrHp(config)({ charId, newHpValue: currHp })
      )
    }

    if (Object.keys(limbs).length > 0) {
      const newHpValue = Object.values(limbs).reduce((acc, curr) => acc + curr, 0)
      promises.push(
        updateLimbsHp(config)({ charId, newLimbsHp: limbs }),
        updateCurrHp(config)({ charId, newHpValue })
      )
    }

    if (rads !== 0) {
      const newRadsValue = getHealth(store, charId).rads
      promises.push(updateRads(config)({ charId, newRadsValue }))
    }

    return Promise.all(promises)
  }
}
