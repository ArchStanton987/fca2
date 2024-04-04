import { AmmoType } from "lib/objects/data/ammo/ammo.types"
import { ClothingId } from "lib/objects/data/clothings/clothings.types"
import { ConsumableId } from "lib/objects/data/consumables/consumables.types"
import { MiscObjectId } from "lib/objects/data/misc-objects/misc-objects-types"
import { WeaponId } from "lib/objects/data/weapons/weapons.types"

export type ObjectExchangeState = {
  weapons: Record<WeaponId, number>
  clothings: Record<ClothingId, number>
  consumables: Record<ConsumableId, number>
  miscObjects: Record<MiscObjectId, number>
  ammo: Record<AmmoType, number>
  caps: number
}

// TODO: refactor to use a Map
export const defaultObjectExchange: ObjectExchangeState = {
  weapons: {} as Record<WeaponId, number>,
  clothings: {} as Record<ClothingId, number>,
  consumables: {} as Record<ConsumableId, number>,
  miscObjects: {} as Record<MiscObjectId, number>,
  ammo: {} as Record<AmmoType, number>,
  caps: 0
}

type Category = Exclude<keyof ObjectExchangeState, "caps">
type ModObjectPayload<C extends Category> = {
  category: C
  id: keyof ObjectExchangeState[C]
  count: number
  inInventory: number
}

export type UpdateObjectAction =
  | { type: "modObject"; payload: ModObjectPayload<Category> }
  | { type: "modCaps"; payload: { count: number; inInventory: number } }
  | { type: "reset"; payload?: undefined }

const objectsReducer = (
  state: ObjectExchangeState,
  { type, payload }: UpdateObjectAction
): ObjectExchangeState => {
  switch (type) {
    case "modObject": {
      const { category, id, count, inInventory } = payload
      const prevValue = state[category][id] ?? 0
      let newValue = prevValue + count
      if (inInventory + newValue < 0) {
        newValue = -inInventory
      }
      return { ...state, [category]: { ...state[category], [id]: newValue } }
    }

    case "modCaps": {
      const { count, inInventory } = payload
      const prevValue = state.caps
      let newValue = prevValue + count
      if (inInventory + newValue < 0) {
        newValue = -inInventory
      }
      return { ...state, caps: newValue }
    }

    case "reset": {
      return defaultObjectExchange
    }

    default: {
      throw Error(`Unknown action : ${type}`)
    }
  }
}

export default objectsReducer
