import { createContext, useContext, useMemo } from "react"

import { useSuspenseQueries } from "@tanstack/react-query"
import effectsMap from "lib/character/effects/effects"
import { EffectData } from "lib/character/effects/effects.types"
import { getCreatedEffectsOptions } from "lib/character/effects/use-cases/get-all-effects"
import clothingsMap from "lib/objects/data/clothings/clothings"
import { ClothingData } from "lib/objects/data/clothings/clothings.types"
import { getCreatedClothingsOptions } from "lib/objects/data/clothings/use-cases/get-all-clothings"
import consumablesMap from "lib/objects/data/consumables/consumables"
import { ConsumableData } from "lib/objects/data/consumables/consumables.types"
import { getCreatedConsumablesOptions } from "lib/objects/data/consumables/use-cases/get-all-consumables"
import miscObjectsMap from "lib/objects/data/misc-objects/misc-objects"
import { MiscObjectData } from "lib/objects/data/misc-objects/misc-objects-types"
import { getCreatedMiscObjectsOptions } from "lib/objects/data/misc-objects/use-cases/get-all-misc-objects"
import { getCreatedWeaponOptions } from "lib/objects/data/weapons/use-cases/get-all-weapons"
import weaponsMap from "lib/objects/data/weapons/weapons"
import { WeaponData } from "lib/objects/data/weapons/weapons.types"

export type AdditionalElContextType = {
  clothings: Record<string, ClothingData>
  consumables: Record<string, ConsumableData>
  miscObjects: Record<string, MiscObjectData>
  effects: Record<string, EffectData>
  weapons: Record<string, WeaponData>
}

const AdditionalElementsContext = createContext<AdditionalElContextType>({
  clothings: {},
  consumables: {},
  miscObjects: {},
  effects: {},
  weapons: {}
})

export default function AdditionalElementsProvider({ children }: { children: React.ReactNode }) {
  const queries = useSuspenseQueries({
    queries: [
      getCreatedWeaponOptions(),
      getCreatedClothingsOptions(),
      getCreatedConsumablesOptions(),
      getCreatedEffectsOptions(),
      getCreatedMiscObjectsOptions()
    ],
    combine: result => ({
      isPending: result.some(r => r.isPending),
      isError: result.some(r => r.isError),
      data: {
        weapons: { ...weaponsMap, ...result[0].data },
        clothings: { ...clothingsMap, ...result[1].data },
        consumables: { ...consumablesMap, ...result[2].data },
        effects: { ...effectsMap, ...result[3].data },
        miscObjects: { ...miscObjectsMap, ...result[4].data }
      }
    })
  })

  const value = useMemo(() => {
    const { weapons, clothings, consumables, miscObjects, effects } = queries.data
    return { weapons, clothings, consumables, miscObjects, effects }
  }, [queries.data])

  return <AdditionalElementsContext value={value}>{children}</AdditionalElementsContext>
}

export function useCollectiblesData() {
  const context = useContext(AdditionalElementsContext)
  if (!context) throw new Error("Additional elements context not found")
  return context
}
export function useWeaponData(id: string) {
  const context = useContext(AdditionalElementsContext)
  if (!context) throw new Error("Additional elements context not found")
  if (!(id in context.weapons)) throw new Error(`Could not find weapon with id : ${id}`)
  return context.weapons[id]
}
export function useClothingData(id: string) {
  const context = useContext(AdditionalElementsContext)
  if (!context) throw new Error("Additional elements context not found")
  if (!(id in context.clothings)) throw new Error(`Could not find clothing with id : ${id}`)
  return context.clothings[id]
}
export function useConsumablesData(id: string) {
  const context = useContext(AdditionalElementsContext)
  if (!context) throw new Error("Additional elements context not found")
  if (!(id in context.consumables)) throw new Error(`Could not find consumable with id : ${id}`)
  return context.consumables[id]
}
export function useMiscObjectsData(id: string) {
  const context = useContext(AdditionalElementsContext)
  if (!context) throw new Error("Additional elements context not found")
  if (!(id in context.miscObjects)) throw new Error(`Could not find misc object with id : ${id}`)
  return context.miscObjects[id]
}
export function useEffectsData(id: string) {
  const context = useContext(AdditionalElementsContext)
  if (!context) throw new Error("Additional elements context not found")
  if (!(id in context.effects)) throw new Error(`Could not find effect with id : ${id}`)
  return context.effects[id]
}
