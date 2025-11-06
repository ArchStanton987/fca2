import { getExp } from "lib/character/progress/exp-provider"
import { getLevelAndThresholds } from "lib/character/status/status-calc"
import { UseCasesConfig } from "lib/get-use-case.types"

import { getHealth } from "../health-provider"
import { LimbId } from "../health.const"
import { UpdateHealthStore } from "../update-health-store"
import updateCurrHp from "./update-curr-hp"
import updateLimbsHp from "./update-limbs-hp"
import updateRads from "./update-rads"

export type UpdateHealthParams = {
  charId: string
  modPayload: Pick<UpdateHealthStore, "currHp" | "limbs" | "rads">
}

export default function updateHealth(config: UseCasesConfig) {
  const { store } = config

  return ({ charId, modPayload }: UpdateHealthParams) => {
    const hpMod = modPayload.currHp
    const limbsMod = modPayload.limbs
    const radsMod = modPayload.rads

    const promises = []

    // limbs & currhp are modified => throw error
    if (hpMod !== 0 && Object.keys(limbsMod).length > 0)
      throw new Error("currHp & limbs should not be modified at the same time")

    const health = getHealth(store, charId)
    const { currHp, limbs } = health

    if (hpMod !== 0) {
      const exp = getExp(store, charId)
      const { level } = getLevelAndThresholds(exp)
      const newLimbsHp = health.getNewLimbsHpFromHpDiff(hpMod, level)
      const newHpValue = currHp + hpMod
      promises.push(
        updateLimbsHp(config)({ charId, newLimbsHp }),
        updateCurrHp(config)({ charId, newHpValue })
      )
    }

    if (Object.keys(limbsMod).length > 0) {
      const withLimbsMod = Object.values(limbsMod).reduce((acc, curr) => acc + curr, 0)
      const newHpValue = currHp + withLimbsMod
      const newLimbsHp = Object.fromEntries(
        Object.entries(limbsMod).map(([id, limbHpMod]) => {
          const currValue = limbs[id as LimbId] ?? 0
          return [id, currValue + limbHpMod]
        })
      )
      promises.push(
        updateLimbsHp(config)({ charId, newLimbsHp }),
        updateCurrHp(config)({ charId, newHpValue })
      )
    }

    if (radsMod !== 0) {
      const currRads = getHealth(store, charId).rads
      promises.push(updateRads(config)({ charId, newRadsValue: currRads + radsMod }))
    }

    return Promise.all(promises)
  }
}
