import { useMemo } from "react"

import effectsMap from "lib/character/effects/effects"
import EffectsMappers from "lib/character/effects/effects.mappers"
import { DbEffectData, EffectData } from "lib/character/effects/effects.types"
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
import getUseCases from "lib/shared/db/get-use-cases"

import { AdditionalElementsContext } from "contexts/AdditionalElementsContext"
import useRtdbSub from "hooks/db/useRtdbSub"

const useCases = getUseCases("rtdb")

export default function AdditionalElementsProvider({ children }: { children: React.ReactNode }) {
  const newClothings = useRtdbSub(useCases.additional.subAdditionalClothings())
  const newConsumables = useRtdbSub(useCases.additional.subAdditionalConsumables())
  const newMiscObjects = useRtdbSub(useCases.additional.subAdditionalMisc())
  const newEffects = useRtdbSub(useCases.additional.subAdditionalEffects())

  const clothings = useMemo(() => {
    if (!newClothings) return clothingsMap
    const newClothingsArr = Object.values(newClothings) as unknown as DbClothingData[]
    const result = {} as Record<ClothingId, ClothingData>
    newClothingsArr.forEach((clothing: DbClothingData) => {
      const clothingData = ClothingsMappers.toDomain(clothing)
      result[clothingData.id] = clothingData
    })
    return { ...clothingsMap, ...result }
  }, [newClothings])

  const consumables = useMemo(() => {
    if (!newConsumables) return consumablesMap
    const newConsumablesArr = Object.values(newConsumables) as unknown as DbConsumableData[]
    const result = {} as Record<string, ConsumableData>
    newConsumablesArr.forEach((consumable: DbConsumableData) => {
      const consumableData = ConsumablesMapper.toDomain(consumable)
      result[consumableData.id] = consumableData
    })
    return { ...consumablesMap, ...result }
  }, [newConsumables])

  const miscObjects = useMemo(() => {
    if (!newMiscObjects) return miscObjectsMap
    const newMiscObjectsArr = Object.values(newMiscObjects) as unknown as DbMiscObjectData[]
    const result = {} as Record<string, MiscObjectData>
    newMiscObjectsArr.forEach(miscObject => {
      const miscObjectData = MiscObjectsMappers.toDomain(miscObject)
      result[miscObjectData.id] = miscObjectData
    })
    return { ...miscObjectsMap, ...result }
  }, [newMiscObjects])

  const effects = useMemo(() => {
    if (!newEffects) return effectsMap
    const newEffectsArr = Object.values(newEffects) as unknown as DbEffectData[]
    const result = {} as Record<string, EffectData>
    newEffectsArr.forEach(effect => {
      const effectData = EffectsMappers.toDomain(effect)
      result[effectData.id] = effectData
    })
    return { ...effectsMap, ...result }
  }, [newEffects])

  const value = useMemo(
    () => ({ clothings, consumables, miscObjects, effects }),
    [clothings, consumables, miscObjects, effects]
  )
  return (
    <AdditionalElementsContext.Provider value={value}>
      {children}
    </AdditionalElementsContext.Provider>
  )
}
