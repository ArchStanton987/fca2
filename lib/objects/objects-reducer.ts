import { Ammo } from "./data/ammo/ammo.types"
import { Clothing } from "./data/clothings/clothings.types"
import { Consumable } from "./data/consumables/consumables.types"
import { MiscObject } from "./data/misc-objects/misc-objects-types"
import { DbInventory } from "./data/objects.types"
import { Weapon } from "./data/weapons/weapons.types"

export type ObjectExchangeState = { count: number; label: string; inInventory: number }
type Caps = { id: "caps" }
export type ExchangeableObject = Ammo | Weapon | Clothing | Consumable | MiscObject | Caps
export type ExchangeCategory<Object extends ExchangeableObject> = Record<
  Object["id"],
  ObjectExchangeState
>

export const defaultObjectExchange = {
  weapons: {} as ExchangeCategory<Weapon>,
  clothings: {} as ExchangeCategory<Clothing>,
  consumables: {} as ExchangeCategory<Consumable>,
  miscObjects: {} as ExchangeCategory<MiscObject>,
  ammo: {} as ExchangeCategory<Ammo>,
  caps: {} as ExchangeCategory<Caps>
}

export type AddObjectPayload<
  Category extends keyof DbInventory,
  Object extends ExchangeableObject
> = {
  category: Category
  id: Object["id"]
  count: number
  label: string
  inInventory: number
}

export type ExchangeState = Record<keyof DbInventory, ExchangeCategory<ExchangeableObject>>

export type UpdateObjectAction<Cat extends keyof DbInventory, Obj extends ExchangeableObject> =
  | { type: "modObject"; payload: AddObjectPayload<Cat, Obj> }
  | { type: "reset"; payload?: undefined }

const objectsReducer = <Cat extends keyof DbInventory, Obj extends ExchangeableObject>(
  state: ExchangeState,
  { type, payload }: UpdateObjectAction<Cat, Obj>
): ExchangeState => {
  switch (type) {
    case "modObject": {
      const { category, id, count, label, inInventory } = payload
      const prevValue = state[category][id]?.count ?? 0
      let newValue = prevValue + count
      if (inInventory + newValue < 0) {
        newValue = -inInventory
      }
      return {
        ...state,
        [category]: { ...state[category], [id]: { count: newValue, label, inInventory } }
      }
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
