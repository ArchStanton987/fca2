/* eslint-disable import/prefer-default-export */
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
    if (symptom.id === key) {
      return applyMod(acc, symptom)
    }
    return acc
  }, 0)
  return mods
}

// export const getChangedAttributes = (modifiers: Modifier[]) =>
//   modifiers.reduce((acc, modifier) => {
//     const { id, value } = modifier
//     if (specialMap[id] !== undefined) {
//       const special = specialMap[id]
//       const { secAttrs } = special
//       if (secAttrs) {
//         return secAttrs.reduce((acc, secAttr) => {
//           const { id: secId, value: secValue } = secAttr
//           return { ...acc, [secId]: secValue }
//         }, acc)
//       }
//     }
//     return { ...acc, [id]: value }
//   }, {} as Record<ChangeableAttribute, number>)
