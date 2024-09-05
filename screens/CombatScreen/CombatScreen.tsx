import React from "react"
import { View } from "react-native"

import useCases from "lib/common/use-cases"

import CheckBox from "components/CheckBox/CheckBox"
import DrawerPage from "components/DrawerPage"
import List from "components/List"
import Section from "components/Section"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"
import { useInventory } from "contexts/InventoryContext"

import styles from "./CombatScreen.styles"
import WeaponCard from "./WeaponCard"

export default function CombatScreen() {
  const character = useCharacter()
  const inventory = useInventory()
  const { status, secAttr, equipedObjects } = character
  const equWeapons = equipedObjects.weapons
  const { currAp } = status
  const maxAp = secAttr.curr.actionPoints
  const weapons = equWeapons.map(eW => inventory.weaponsRecord[eW.dbKey])

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
      <View style={{ flex: 1 }}>
        <Section>
          <Txt>
            Points d&apos;action : {currAp} / {maxAp}
          </Txt>
          <Spacer y={20} />

          <View style={styles.checkboxContainer}>
            {apArr.map((ap, i) => (
              <CheckBox size={22} key={ap} isChecked={i < currAp} onPress={() => handleSetAp(i)} />
            ))}
          </View>
        </Section>

        <Spacer y={20} />
        <View style={{ flexDirection: "row" }}>
          <List
            data={weapons}
            keyExtractor={item => item.dbKey}
            horizontal
            separator={<Spacer x={15} />}
            renderItem={({ item }) => <WeaponCard weapon={item} />}
          />
        </View>
      </View>
    </DrawerPage>
  )
}
