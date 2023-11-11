import { SpecialValues } from "models/abilities/special/special-types"
import { TraitId } from "models/abilities/traits/traits-types"
import { Effect } from "models/effects/effect-types"

const healthMods = {
  addictChance: {
    id: "addictChance",
    calc: (SPECIAL: SpecialValues, traits: TraitId[]) =>
      traits.includes("chemReliant") ? SPECIAL.endurance * 10 * 1.5 : SPECIAL.endurance * 10
  },
  withdrawLength: {
    id: "withdrawLength",
    calc: (initLength: Effect["length"], traits: TraitId[]) =>
      typeof initLength === "number" && traits.includes("chemReliant")
        ? initLength * 0.5
        : initLength
  }
}

export default healthMods
