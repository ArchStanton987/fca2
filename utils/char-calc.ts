/* eslint-disable import/prefer-default-export */
import { Symptom } from "models/character/effects/symptom"
import { SecAttrId } from "models/character/sec-attr/sec-attr-types"
import { SkillId } from "models/character/skills/skills-types"
import { SpecialId } from "models/character/special/special-types"

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

type ModifiableAttribute = SpecialId | SecAttrId | SkillId

export const getModAttribute = (symptoms: Symptom[], key: ModifiableAttribute) => {
  const mods = symptoms.reduce((acc, symptom) => {
    if (symptom.id === key) {
      return applyMod(acc, symptom)
    }
    return acc
  }, 0)
  return mods
}
