/* eslint-disable import/prefer-default-export */
import { DbAbilities } from "db/db-types"

import { Symptom } from "models/character/effects/symptom"
import allPerks from "models/character/perks/perks"
import { SpecialId } from "models/character/special/special-types"
import allTraits from "models/character/traits/traits"

const applyMod = (initValue: number, symptom: Symptom) => {
  const { operation, value } = symptom
  switch (operation) {
    case "add":
      return initValue + value
    case "mult":
      return initValue * value
    case "abs":
      return value
    default:
      return initValue
  }
}

export const getBase = (dbAbilities: DbAbilities, key: SpecialId) => {
  const { traits = [], perks = [] } = dbAbilities
  const traitsSymptoms = traits.map(traitId =>
    allTraits[traitId].symptoms.filter(symptom => symptom.id === key)
  )
  const perksSymptoms = perks.map(traitId =>
    allPerks[traitId].symptoms.filter(symptom => symptom.id === key)
  )
  const symptoms = [...traitsSymptoms, ...perksSymptoms].flat()
  const mods = symptoms.reduce((acc, symptom) => {
    if (symptom.id === key) {
      return applyMod(acc, symptom)
    }
    return acc
  }, 0)
  return mods
}
