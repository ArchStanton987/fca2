import { ChangeableAttribute, Symptom } from "lib/character/effects/symptoms.type"

export const applyMod = (initValue: number, symptom: Symptom) => {
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

export const getModAttribute = (symptoms: Symptom[], key: ChangeableAttribute) => {
  const mods = symptoms.reduce((acc, symptom) => {
    if (symptom.id !== key) return acc
    let newAcc = acc
    const { level = 1 } = symptom
    for (let i = 1; i <= level; i += 1) {
      newAcc = applyMod(newAcc, symptom)
    }
    return newAcc
  }, 0)
  return mods
}
