import React from "react"

import ammoMap from "lib/objects/data/ammo/ammo"
import { getCanLoad, getCanUnload } from "lib/objects/data/weapons/weapons-utils"
import { Weapon, damageTypeMap } from "lib/objects/data/weapons/weapons.types"

import List from "components/List"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import RevertColorsPressable from "components/wrappers/RevertColorsPressable/RevertColorsPressable"
import { useCharacter } from "contexts/CharacterContext"
import { useCombatStatus } from "providers/CombatStatusesProvider"
import { useGetUseCases } from "providers/UseCasesProvider"

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
  const useCases = useGetUseCases()
  const char = useCharacter()
  const weaponDetails = charWeapon ? getWeaponDetails(charWeapon) : []
  const { currAp } = useCombatStatus(char.charId)

  const reload = () => {
    if (!charWeapon) return
    useCases.weapons.use(char, charWeapon, "reload")
  }
  const unload = () => {
    if (!charWeapon) return
    useCases.weapons.use(char, charWeapon, "unload")
  }

  const canLoad = charWeapon ? getCanLoad(charWeapon, currAp) : false
  const canUnload = charWeapon ? getCanUnload(charWeapon, currAp) : false

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
        <RevertColorsPressable onPress={() => reload()}>
          <Txt>RECHARGER</Txt>
        </RevertColorsPressable>
      ) : null}
      <Spacer y={20} />
      {canUnload ? (
        <RevertColorsPressable onPress={() => unload()}>
          <Txt>DECHARGER</Txt>
        </RevertColorsPressable>
      ) : null}
      <Spacer y={20} />
    </>
  )
}
