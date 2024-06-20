import React from "react"
import { Image, View } from "react-native"

import useCases from "lib/common/use-cases"
import { fillZeros } from "lib/common/utils/number-utils"
import ammoMap from "lib/objects/data/ammo/ammo"

import CheckBox from "components/CheckBox/CheckBox"
import DrawerPage from "components/DrawerPage"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"
import { useInventory } from "contexts/InventoryContext"
import colors from "styles/colors"

export default function CombatScreen() {
  const character = useCharacter()
  const inventory = useInventory()
  const { status, secAttr, equipedObjects } = character
  const equWeapons = equipedObjects.weapons
  const { currAp } = status
  const maxAp = secAttr.curr.actionPoints
  const weapons = equWeapons.map(eW => inventory.weaponsRecord[eW.dbKey])

  // TODO: add AC in header
  // TODO: add char curr range in header

  const handleSetAp = async (i: number) => {
    const newValue = i < currAp ? i : i + 1
    await useCases.status.updateElement(character, "currAp", newValue)
  }

  const apArr = []
  for (let i = 0; i < maxAp; i += 1) {
    apArr.push(`pa${i}`)
  }

  return (
    <DrawerPage>
      <Txt>Points d&apos;action</Txt>
      <Spacer y={20} />

      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center"
        }}
      >
        {apArr.map((ap, i) => (
          <CheckBox key={ap} isChecked={i < currAp} onPress={() => handleSetAp(i)} />
        ))}
      </View>

      <View style={{ flexDirection: "row" }}>
        {weapons.map(el => (
          <View key={el.id} style={{ flex: 1 }}>
            <Spacer y={10} />
            <Txt>{el.data.label}</Txt>
            <Spacer y={10} />
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  padding: 10,
                  borderWidth: 1,
                  borderColor: colors.secColor
                }}
              >
                <Image
                  source={{ uri: el.data.img }}
                  style={{ height: 50, width: 50 }}
                  resizeMode="contain"
                />
              </View>
              <Spacer x={10} />
              <View>
                <View style={{ flexDirection: "row" }}>
                  <Txt>DEG</Txt>
                  <Spacer x={10} />
                  <Txt>{el.data.damageBasic}</Txt>
                </View>
                {el.data.damageBurst && (
                  <View
                    style={{
                      flexDirection: "row"
                    }}
                  >
                    <Txt style={{ color: colors.primColor }}>DEG</Txt>
                    <Spacer x={10} />
                    <Txt>{el.data.damageBurst}</Txt>
                  </View>
                )}
                <View style={{ flexDirection: "row" }}>
                  <Txt>COMP</Txt>
                  <Spacer x={10} />
                  <Txt>{el.skill}</Txt>
                </View>
                {el.data.range && (
                  <View style={{ flexDirection: "row" }}>
                    <Txt>POR</Txt>
                    <Spacer x={10} />
                    <Txt>{el.data.range}m</Txt>
                  </View>
                )}
              </View>
              <Spacer x={20} />
              {el.data.ammoType && (
                <View style={{ alignItems: "flex-end" }}>
                  <Txt style={{ fontSize: 20 }}>{fillZeros(el.ammo)}</Txt>
                  <View
                    style={{
                      width: 30,
                      height: 2,
                      backgroundColor: colors.secColor
                    }}
                  />
                  <Txt style={{ fontSize: 20 }}>{fillZeros(el.ammo)}</Txt>
                  <Txt style={{ fontSize: 12 }}>{ammoMap[el.data.ammoType].label}</Txt>
                </View>
              )}
            </View>
            <Spacer y={20} />
          </View>
        ))}
      </View>
    </DrawerPage>
  )
}
