import React from "react"
import { TouchableOpacity } from "react-native"

import { useLocalSearchParams } from "expo-router"

import { useCombatStatus } from "lib/character/combat-status/combat-status-provider"
import { useAmmo } from "lib/inventory/use-sub-inv-cat"
import ammoMap from "lib/objects/data/ammo/ammo"
import { getCanLoad, getCanUnload } from "lib/objects/data/weapons/weapons-utils"
import { damageTypeMap } from "lib/objects/data/weapons/weapons.types"

import List from "components/List"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useGetUseCases } from "providers/UseCasesProvider"

import Weapon from "../Weapon"

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
  const { charId } = useLocalSearchParams<{ charId: string }>()
  const useCases = useGetUseCases()
  const weaponDetails = charWeapon ? getWeaponDetails(charWeapon) : []
  const { data: currAp } = useCombatStatus(charId, s => s.currAp)
  const { data: ammo } = useAmmo(charId)

  const reload = () => {
    if (!charWeapon) return
    useCases.weapons.load({ charId, weapon: charWeapon })
  }
  const unload = () => {
    if (!charWeapon) return
    useCases.weapons.unload({ charId, weapon: charWeapon })
  }

  const canLoad = charWeapon ? getCanLoad(charWeapon, { currAp }, ammo) : false
  const canUnload = charWeapon ? getCanUnload(charWeapon, { currAp }) : false

  return (
    <>
      <List
        keyExtractor={item => item.label}
        data={weaponDetails}
        renderItem={({ item }) => (
          <Txt>
            {item.label}: {item.value}
          </Txt>
        )}
      />
      <Spacer y={20} />
      {canLoad ? (
        <TouchableOpacity onPress={() => reload()}>
          <Txt>RECHARGER</Txt>
        </TouchableOpacity>
      ) : null}
      <Spacer y={20} />
      {canUnload ? (
        <TouchableOpacity onPress={() => unload()}>
          <Txt>DECHARGER</Txt>
        </TouchableOpacity>
      ) : null}
      <Spacer y={20} />
    </>
  )
}
