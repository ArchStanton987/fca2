import { useMemo } from "react"

import getUseCases from "lib/get-use-cases"
import clothingsMap from "lib/objects/data/clothings/clothings"
import ClothingsMappers from "lib/objects/data/clothings/clothings.mappers"
import {
  ClothingData,
  ClothingId,
  DbClothingData
} from "lib/objects/data/clothings/clothings.types"
import consumablesMap from "lib/objects/data/consumables/consumables"
import ConsumablesMapper from "lib/objects/data/consumables/consumables.mappers"
import { ConsumableData, DbConsumableData } from "lib/objects/data/consumables/consumables.types"
import miscObjectsMap from "lib/objects/data/misc-objects/misc-objects"
import { DbMiscObjectData, MiscObjectData } from "lib/objects/data/misc-objects/misc-objects-types"
import MiscObjectsMappers from "lib/objects/data/misc-objects/misc-objects.mappers"

import { AdditionalElementsContext } from "contexts/AdditionalElementsContext"
import useRtdbSub from "hooks/db/useRtdbSub"

const useCases = getUseCases()

export default function AdditionalElementsProvider({ children }: { children: React.ReactNode }) {
  const clothings = useRtdbSub(useCases.additional.subAdditionalClothings())
  const consumables = useRtdbSub(useCases.additional.subAdditionalConsumables())
  const miscObjects = useRtdbSub(useCases.additional.subAdditionalMisc())
  // const effects = useRtdbSub(useCases.additional.subAdditionalEffects())

  const newClothings = useMemo(() => {
    if (!clothings) return clothingsMap
    const newClothingsArr = Object.values(clothings) as unknown as DbClothingData[]
    const result = {} as Record<ClothingId, ClothingData>
    newClothingsArr.forEach((clothing: DbClothingData) => {
      const clothingData = ClothingsMappers.toDomain(clothing)
      result[clothingData.id] = clothingData
    })
    return { ...clothingsMap, ...result }
  }, [clothings])

  const newConsumables = useMemo(() => {
    if (!consumables) return consumablesMap
    const newConsumablesArr = Object.values(consumables) as unknown as DbConsumableData[]
    const result = {} as Record<string, ConsumableData>
    newConsumablesArr.forEach((consumable: DbConsumableData) => {
      const consumableData = ConsumablesMapper.toDomain(consumable)
      result[consumableData.id] = consumableData
    })
    return { ...consumablesMap, ...result }
  }, [consumables])

  const newMiscObjects = useMemo(() => {
    if (!miscObjects) return miscObjectsMap
    const newMiscObjectsArr = Object.values(miscObjects) as unknown as DbMiscObjectData[]
    const result = {} as Record<string, MiscObjectData>
    newMiscObjectsArr.forEach(miscObject => {
      const miscObjectData = MiscObjectsMappers.toDomain(miscObject)
      result[miscObjectData.id] = miscObjectData
    })
    return { ...miscObjectsMap, ...result }
  }, [miscObjects])

  // const newEffects = useMemo(() => {
  //   if (!effects) return effectsMap
  //   const newEffectsArr = Object.values(effects) as unknown as DbEffectData[]
  //   const result = {} as Record<string, EffectData>
  //   newEffectsArr.forEach(effect => {
  //     const effectData = EffectsMappers.toDomain(effect)
  //     result[effectData.id] = effectData
  //   })
  //   return { ...effectsMap, ...result }
  // }, [effects])

  const value = useMemo(
    () => ({
      newClothings,
      newConsumables,
      newMiscObjects
      //  newEffects
    }),
    [
      newClothings,
      newConsumables,
      newMiscObjects
      //  newEffects
    ]
  )
  return (
    <AdditionalElementsContext.Provider value={value}>
      {children}
    </AdditionalElementsContext.Provider>
  )
}
