import React from "react"

import ammoMap from "lib/objects/data/ammo/ammo"
import { Weapon, damageTypeMap } from "lib/objects/data/weapons/weapons.types"

import List from "components/List"
import Txt from "components/Txt"

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
    <List
      keyExtractor={item => item.label}
      data={weaponDetails}
      renderItem={({ item }) => (
        <Txt>
          {item.label}: {item.value}
        </Txt>
      )}
    />
  )
}
