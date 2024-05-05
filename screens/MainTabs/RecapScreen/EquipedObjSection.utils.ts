import { SecAttrsValues } from "lib/character/abilities/sec-attr/sec-attr-types"

import colors from "styles/colors"

export const getWeightColor = (currWeight: number, secAttr: SecAttrsValues) => {
  const { normalCarryWeight, tempCarryWeight, maxCarryWeight } = secAttr
  if (currWeight <= normalCarryWeight) {
    return colors.secColor
  }
  if (currWeight <= tempCarryWeight) {
    return colors.yellow
  }
  if (currWeight <= maxCarryWeight) {
    return colors.orange
  }
  return colors.red
}

export const getPlaceColor = (currPlace: number, maxPlace: number) => {
  if (currPlace <= maxPlace) {
    return colors.secColor
  }
  return colors.red
}
