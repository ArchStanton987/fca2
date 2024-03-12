import React from "react"
import { FlatList } from "react-native"

import { useLocalSearchParams } from "expo-router"

import ammoMap from "lib/objects/ammo/ammo"
import weaponsMap from "lib/objects/weapons/weapons"
import { damageTypeMap } from "lib/objects/weapons/weapons.types"

import { DrawerParams } from "components/Drawer/Drawer.params"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import useGetAbilities from "hooks/db/useGetAbilities"
import { CharWeapon } from "hooks/db/useGetInventory"
import { SearchParams } from "screens/ScreenParams"

function Header() {
  return (
    <>
      <Txt>DETAILS</Txt>
      <Spacer y={10} />
    </>
  )
}

const getWeaponDetails = ({ id, basicApCost }: CharWeapon, hasMrFast: boolean) => {
  const weapon = weaponsMap[id]
  return [
    {
      label: "PA",
      value: hasMrFast
        ? `${basicApCost || "-"}`
        : `${basicApCost || "-"} / ${weapon.specialApCost || "-"}`
    },
    { label: "TYPE DEG.", value: `${damageTypeMap[weapon.damageType].short || "-"}` },
    {
      label: "TYPE MUN.",
      value: `${weapon.ammoType ? ammoMap[weapon.ammoType].label : "-"}`
    },
    { label: "CT. CHARG", value: `${weapon.magazine || "-"}` },
    { label: "MUN. / COUP", value: `${weapon.ammoPerShot || "-"}` },
    { label: "MUN. / RA.", value: `${weapon.ammoPerBurst || "-"}` },
    { label: "FO MIN.", value: `${weapon.minStrength || "-"}` },
    { label: "PORTEE", value: `${weapon.range || "-"}` },
    { label: "PLACE", value: `${weapon.place || "-"}` },
    { label: "POIDS", value: `${weapon.weight || "-"}` }
  ]
}

export default function WeaponsDetails({ charWeapon }: { charWeapon?: CharWeapon }) {
  const { charId } = useLocalSearchParams() as SearchParams<DrawerParams>
  const abilities = useGetAbilities(charId)
  const hasMrFast = !!abilities?.traits.includes("mrFast")
  const weaponDetails = charWeapon ? getWeaponDetails(charWeapon, hasMrFast) : []
  return (
    <FlatList
      data={weaponDetails}
      ListHeaderComponent={Header}
      stickyHeaderIndices={[0]}
      renderItem={({ item }) => (
        <Txt>
          {item.label}: {item.value}
        </Txt>
      )}
    />
  )
}
