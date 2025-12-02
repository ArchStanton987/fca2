import React from "react"
import { View } from "react-native"

import { fillZeros } from "lib/common/utils/number-utils"
import { useAmmo, useCombatWeapons } from "lib/inventory/use-sub-inv-cat"
import ammoMap from "lib/objects/data/ammo/ammo"

import Col from "components/Col"
import Txt from "components/Txt"
import colors from "styles/colors"

type AmmoIndicatorProps = {
  charId: string
  weaponKey: string
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

export default function AmmoIndicator({ charId, weaponKey }: AmmoIndicatorProps) {
  const { data: ammo } = useAmmo(charId)
  const weapons = useCombatWeapons(charId)
  const weapon = weapons.find(w => w.dbKey === weaponKey)
  if (!weapon || weapon.category !== "weapons") return null
  if (weapon.data.ammoType === null) return null
  const inMagazine = weapon?.inMagazine || 0
  const ammoLabel = ammoMap[weapon.data.ammoType].label
  return (
    <Col style={{ alignItems: "flex-start" }}>
      <Txt style={{ fontSize: 20 }}>{fillZeros(inMagazine)}</Txt>
      <View style={{ width: 30, height: 2, backgroundColor: colors.secColor }} />
      <Txt style={{ fontSize: 20 }}>{fillZeros(weapon.getAmmoCount(ammo) ?? 0)}</Txt>
      <Txt style={{ fontSize: 12 }}>{ammoLabel}</Txt>
    </Col>
  )
}
