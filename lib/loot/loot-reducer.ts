import { LootState } from "lib/loot/loot-types"
import { AmmoType } from "lib/objects/ammo/ammo.types"
import { ClothingId } from "lib/objects/clothings/clothings.types"
import { ConsumableId } from "lib/objects/consumables/consumables.types"
import { MiscObjectId } from "lib/objects/misc-objects/misc-objects-types"
import { WeaponId } from "lib/objects/weapons/weapons.types"

type Category = Omit<keyof LootState, "ammo" | "caps">
type CollectibleId = WeaponId | ClothingId | ConsumableId | MiscObjectId

type Action =
  | {
      type: "modCollectible"
      payload: { category: Category; id: CollectibleId; count: number; currSum: number }
    }
  | { type: "modAmmo"; payload: { id: AmmoType; count: number; currSum: number } }
  | { type: "modCaps"; payload: { count: number; currSum: number } }

const lootReducer = (state: LootState, { type, payload }: Action): LootState => {
  const { count = 0, currSum = 0 } = payload

  switch (type) {
    case "modCollectible": {
      const { category, id } = payload
      const prevValue = state[category].find(el => el.id === id)?.count ?? 0
      let newValue = prevValue + count
      if (currSum + newValue < 0) {
        newValue = -currSum
      }
      if (count === 0) {
        return {
          ...state,
          [category]: state[category].filter(el => el.id !== id)
        }
      }
      return {
        ...state,
        [category]: state[category].map(el => (el.id === id ? { ...el, count: newValue } : el))
      }
    }
    // case "addCollectible": {
    //   const newArr = []
    //   for (let i = 1; i <= count; i += 1) {
    //     newArr.push(id)
    //   }
    //   return { ...state, [category]: [...state[category]].concat(newArr) }
    // }

    // case "removeCollectible": {
    //   let newArray = [...state[category]]
    //   for (let i = 1; i <= Math.abs(count); i += 1) {
    //     const index = state[category].findIndex(el => el === id)
    //     if (index === -1) {
    //       return { ...state }
    //     }
    //     newArray = newArray.filter((_, n) => n !== index)
    //   }
    //   return { ...state, [category]: newArray }
    // }

    case "modAmmo": {
      const prevValue = state[category][id] ?? 0
      let newValue = prevValue + count
      if (sumAmmo + newValue < 0) {
        newValue = -sumAmmo
      }
      if (count === 0) {
        const cpy = { ...state }
        delete cpy[category][id]
        return { ...cpy }
      }
      return {
        ...state,
        [category]: { ...state[category], [id]: newValue }
      }
    }

    case "modCaps": {
      const prevValue = state[category]
      let newValue = prevValue + count
      if (sumCaps + newValue < 0) {
        newValue = -sumCaps
      }
      return { ...state, [category]: newValue }
    }

    default: {
      throw Error(`Unknown action : ${type}`)
    }
  }
}

export default lootReducer
