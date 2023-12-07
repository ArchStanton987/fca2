import React from "react"
import { View } from "react-native"

import { useLocalSearchParams } from "expo-router"

import CheckBox from "components/CheckBox/CheckBox"
import { DrawerParams } from "components/Drawer/Drawer.params"
import Section from "components/Section"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import useGetEquipedObj from "hooks/db/useGetEquipedObj"
import { CharInventory, getCurrCarry, useGetInventory } from "hooks/db/useGetInventory"
import clothingsMap from "models/objects/clothing/clothings"
import weaponsMap from "models/objects/weapon/weapons"
import { useCurrAttr } from "providers/CurrAttrProvider"
import { SearchParams } from "screens/ScreenParams"

export default function EquipedObjSection() {
  const { charId } = useLocalSearchParams() as SearchParams<DrawerParams>
  const { currSecAttr } = useCurrAttr()
  const inventory = useGetInventory(charId) || ({} as CharInventory)
  const equipedObj = useGetEquipedObj(charId)
  const weapons = equipedObj?.weapons || []
  const clothings = equipedObj?.clothings || []
  const { currPlace, currWeight } = getCurrCarry(inventory, { weapons, clothings })
  return (
    <View style={{ flex: 1 }}>
      <Section style={{ flex: 1 }}>
        <Txt>ARMES EQUIPEES</Txt>
        <Spacer y={10} />
        {weapons.map(weapon => (
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <CheckBox isChecked />
            <Txt>{weaponsMap[weapon.id].label}</Txt>
          </View>
        ))}
      </Section>
      <Section style={{ flex: 1 }}>
        <Txt>ARMURES EQUIPEES</Txt>
        <Spacer y={10} />
        {clothings.map(cloth => (
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <CheckBox isChecked />
            <Txt>{clothingsMap[cloth.id].label}</Txt>
          </View>
        ))}
      </Section>
      <Section>
        <Txt>{`POIDS (${currSecAttr?.normalCarryWeight}/${currSecAttr?.tempCarryWeight}/${currSecAttr?.maxCarryWeight})`}</Txt>
        <Spacer y={10} />
        <Txt>{currWeight}</Txt>
        <Spacer y={10} />
        <Txt>PLACE</Txt>
        <Spacer y={10} />
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Txt>
            {currPlace} / {currSecAttr?.maxPlace || "-"}
          </Txt>
        </View>
      </Section>
    </View>
  )
}
