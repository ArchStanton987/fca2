// import { getRepository } from "lib/RepositoryBuilder"
// import { DbEffect, EffectData, EffectId } from "lib/character/effects/effects.types"
// import { CreatedElements, defaultCreatedElements } from "lib/objects/created-elements"

// import Playable from "../Playable"
// import Abilities from "../abilities/Abilities"
// import Effect from "./Effect"
// import effectsMap from "./effects"

// export const getEffectLengthInMs = (traits: Abilities["traits"], effect: EffectData) => {
//   const isChemReliant = Object.values(traits ?? {}).some(t => t === "chemReliant")
//   if (typeof effect?.length !== "number") return null
//   const isWithdrawal = effect.type === "withdrawal"
//   const lengthInH = isWithdrawal && isChemReliant ? effect.length * 0.5 : effect.length
//   return lengthInH * 60 * 60 * 1000
// }

// type DbEffectPayload = {
//   abilities: Abilities
//   gameDate: Date
//   effectId: EffectId
//   startDate?: Date
//   effectLengthInMs?: number
//   withCreatedEffects: Record<EffectId, EffectData>
// }
// const createDbEffect = (payload: DbEffectPayload) => {
//   const {
//     abilities,
//     gameDate,
//     effectId,
//     startDate,
//     effectLengthInMs,
//     withCreatedEffects = effectsMap
//   } = payload
//   const refStartDate = startDate || gameDate
//   const dbEffect: DbEffect = { id: effectId, startTs: refStartDate.toJSON() }
//   const lengthInMs =
//     effectLengthInMs ?? getEffectLengthInMs(abilities.traits, withCreatedEffects[effectId])
//   if (lengthInMs) {
//     dbEffect.endTs = new Date(refStartDate.getTime() + lengthInMs).toJSON()
//   }
//   return dbEffect
// }

// function getEffectsUseCases(
//   db: keyof typeof getRepository = "rtdb",
//   { newEffects }: CreatedElements = defaultCreatedElements
// ) {
//   const repository = getRepository[db].effects

//   const allEffects = { ...effectsMap, ...newEffects }

//   return {
//     get: (charId: string, effectId: EffectId) => repository.get(charId, effectId),

//     getAll: (charId: string) => repository.getAll(charId),

//     add: async (payload: {
//       charId: string
//       abilities: Abilities
//       effects: Record<EffectId, Effect>
//       effectId: EffectId
//       gameDate: Date
//       startDate?: Date
//       lengthInMs?: number
//     }) => {
//       const { charId, abilities, effects, effectId, gameDate, startDate, lengthInMs } = payload
//       const dbEffect = createDbEffect({
//         abilities,
//         effectId,
//         gameDate,
//         startDate,
//         effectLengthInMs: lengthInMs,
//         withCreatedEffects: allEffects
//       })
//       const existingEffect = effects[effectId]
//       if (existingEffect) {
//         return repository.update(charId, existingEffect.dbKey, dbEffect)
//       }
//       return repository.add(charId, dbEffect)
//     },

//     // we process one start date for each effect, as start dates can be different inside a batch of effects (e.g. datetime update)
//     groupAdd: (
//       char: Playable,
//       effects: { effectId: EffectId; startDate?: Date; lengthInMs?: number }[]
//     ) => {
//       const newDbEffects: DbEffect[] = []
//       const updatedDbEffects: { dbKey: Effect["dbKey"]; updatedEffect: DbEffect }[] = []
//       effects.forEach(({ effectId, startDate, lengthInMs }) => {
//         // const dbEffect = createDbEffect(char, effectId, startDate, lengthInMs, allEffects)
//         const dbEffect = createDbEffect({
//           char,
//           effectId,
//           gameDate: startDate,
//           effectLengthInMs: lengthInMs,
//           withCreatedEffects: allEffects
//         })
//         const existingEffect = char.effectsRecord[effectId]
//         if (existingEffect) {
//           updatedDbEffects.push({ dbKey: existingEffect.dbKey, updatedEffect: dbEffect })
//         } else {
//           newDbEffects.push(dbEffect)
//         }
//       })
//       const promises = [
//         repository.groupAdd(char.charId, newDbEffects),
//         repository.groupUpdate(char.charId, updatedDbEffects)
//       ]
//       return Promise.all(promises)
//     },

//     remove: async (charId: string, effect: Effect) => repository.remove(charId, effect),

//     groupRemove: (charId: string, effects: Effect[]) => repository.groupRemove(charId, effects)
//   }
// }

// export default getEffectsUseCases
