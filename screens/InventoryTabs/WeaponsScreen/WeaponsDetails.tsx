import React from "react"
import { FlatList, View } from "react-native"

import ammoMap from "lib/objects/data/ammo/ammo"
import { Weapon, damageTypeMap } from "lib/objects/data/weapons/weapons.types"

import Spacer from "components/Spacer"
import Txt from "components/Txt"
import colors from "styles/colors"

function Header() {
  return (
    <View style={{ backgroundColor: colors.primColor }}>
      <Txt>DETAILS</Txt>
      <Spacer y={10} />
    </View>
  )
}

const getWeaponDetails = ({ data }: Weapon) => [
  { label: "PA", value: `${data.basicApCost || "-"} / ${data.specialApCost || "-"}` },
  { label: "TYPE DEG.", value: `${damageTypeMap[data.damageType].short || "-"}` },
  { label: "TYPE MUN.", value: `${data.ammoType ? ammoMap[data.ammoType].label : "-"}` },
  { label: "CT. CHARG", value: `${data.magazine || "-"}` },
  { label: "MUN. / COUP", value: `${data.ammoPerShot || "-"}` },
  { label: "MUN. / RA.", value: `${data.ammoPerBurst || "-"}` },
  { label: "FO MIN.", value: `${data.minStrength || "-"}` },
  { label: "PORTEE", value: `${data.range || "-"}` },
  { label: "PLACE", value: `${data.place || "-"}` },
  { label: "POIDS", value: `${data.weight || "-"}` }
]

export default function WeaponsDetails({ charWeapon }: { charWeapon: Weapon | null }) {
  const weaponDetails = charWeapon ? getWeaponDetails(charWeapon) : []
  return (
    <FlatList
      data={weaponDetails}
      ListHeaderComponent={Header}
      ListFooterComponent={<Spacer y={10} />}
      stickyHeaderIndices={[0]}
      renderItem={({ item }) => (
        <Txt>
          {item.label}: {item.value}
        </Txt>
      )}
    />
  )
}
