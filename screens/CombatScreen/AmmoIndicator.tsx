import React from "react"
import { View } from "react-native"

import { fillZeros } from "lib/common/utils/number-utils"
import ammoMap from "lib/objects/data/ammo/ammo"
import { Weapon } from "lib/objects/data/weapons/weapons.types"

// import ProgressionBar from "components/ProgressionBar/ProgressionBar"
// import Spacer from "components/Spacer"
import Txt from "components/Txt"
import colors from "styles/colors"

type AmmoIndicatorProps = {
  weapon: Weapon
}

function AmmoFraction({ weapon }: AmmoIndicatorProps) {
  const inMagazine = weapon?.inMagazine || 0
  if (weapon.data.ammoType === null) return null
  return (
    <View style={{ alignItems: "flex-end" }}>
      <Txt style={{ fontSize: 20 }}>{fillZeros(inMagazine)}</Txt>
      <View style={{ width: 30, height: 2, backgroundColor: colors.secColor }} />
      <Txt style={{ fontSize: 20 }}>{fillZeros(weapon.ammo)}</Txt>
      <Txt style={{ fontSize: 12 }}>{ammoMap[weapon.data.ammoType].label}</Txt>
    </View>
  )
}

// function AmmoBar({ weapon }: AmmoIndicatorProps) {
//   if (typeof weapon.data.magazine !== "number") return null
//   return (
//     <View style={{ transform: [{ rotate: "90deg" }], backgroundColor: "blue" }}>
//       <ProgressionBar
//         max={weapon.data.magazine}
//         value={weapon.inMagazine || 0}
//         height={10}
//         width={40}
//       />
//     </View>
//   )
// }

export default function AmmoIndicator({ weapon }: AmmoIndicatorProps) {
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
      <AmmoFraction weapon={weapon} />
      {/* // <Spacer x={10} /> */}
      {/* <AmmoBar weapon={weapon} /> */}
    </View>
  )
}
