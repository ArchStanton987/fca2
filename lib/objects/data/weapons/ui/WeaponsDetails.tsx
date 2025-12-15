import React from "react"
import { StyleSheet, TouchableOpacity } from "react-native"

import { useCurrCharId } from "lib/character/character-store"
import { useCombatStatus } from "lib/character/combat-status/combat-status-provider"
import { useAmmo, useItems } from "lib/inventory/use-sub-inv-cat"
import ammoMap from "lib/objects/data/ammo/ammo"
import { getCanLoad, getCanUnload } from "lib/objects/data/weapons/weapons-utils"
import { damageTypeMap } from "lib/objects/data/weapons/weapons.types"

import List from "components/List"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useGetUseCases } from "providers/UseCasesProvider"
import colors from "styles/colors"

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

const styles = StyleSheet.create({
  actionButton: {
    padding: 8,
    borderWidth: 2,
    borderColor: colors.secColor,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center"
  }
})

export default function WeaponsDetails({ itemDbKey }: { itemDbKey: string | null }) {
  const charId = useCurrCharId()
  const useCases = useGetUseCases()

  const { data: weapon } = useItems(charId, items =>
    itemDbKey ? (items[itemDbKey] as Weapon) : null
  )

  const weaponDetails = weapon ? getWeaponDetails(weapon) : []
  const { data: currAp } = useCombatStatus(charId, s => s.currAp)
  const { data: ammo } = useAmmo(charId)

  const reload = () => {
    if (!weapon) return
    useCases.weapons.load({ charId, weapon })
  }
  const unload = () => {
    if (!weapon) return
    useCases.weapons.unload({ charId, weapon })
  }

  const canLoad = weapon ? getCanLoad(weapon, { currAp }, ammo) : false
  const canUnload = weapon ? getCanUnload(weapon, { currAp }) : false
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
      {canLoad ? (
        <>
          <Spacer y={20} />
          <TouchableOpacity style={styles.actionButton} onPress={() => reload()}>
            <Txt>RECHARGER</Txt>
          </TouchableOpacity>
        </>
      ) : null}
      {canUnload ? (
        <>
          <Spacer y={20} />
          <TouchableOpacity style={styles.actionButton} onPress={() => unload()}>
            <Txt>DECHARGER</Txt>
          </TouchableOpacity>
        </>
      ) : null}
      <Spacer y={20} />
    </>
  )
}
