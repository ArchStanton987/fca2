export const defaultObjectExchange = {
  weapons: {} as Record<string, { count: number; label: string; inInventory: number }>,
  clothings: {} as Record<string, { count: number; label: string; inInventory: number }>,
  consumables: {} as Record<string, { count: number; label: string; inInventory: number }>,
  miscObjects: {} as Record<string, { count: number; label: string; inInventory: number }>,
  ammo: {} as Record<string, { count: number; label: string; inInventory: number }>,
  caps: {} as Record<string, { count: number; label: string; inInventory: number }>
}

export type AddObjectPayload = {
  category: keyof typeof defaultObjectExchange
  id: string
  count: number
  label: string
  inInventory: number
}

export type ExchangeState = typeof defaultObjectExchange

export type UpdateObjectAction =
  | { type: "modObject"; payload: AddObjectPayload }
  | { type: "reset"; payload?: undefined }

const objectsReducer = (
  state: ExchangeState,
  { type, payload }: UpdateObjectAction
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
