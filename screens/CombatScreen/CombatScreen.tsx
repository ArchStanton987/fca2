import React, { memo, useState } from "react"
import { ScrollView, View } from "react-native"

import CheckBox from "components/CheckBox/CheckBox"
import DrawerPage from "components/DrawerPage"
import List from "components/List"
import Section from "components/Section"
import Spacer from "components/Spacer"
import { useCharacter } from "contexts/CharacterContext"
import { useInventory } from "contexts/InventoryContext"
import { useGetUseCases } from "providers/UseCasesProvider"
import colors from "styles/colors"

import styles from "./CombatScreen.styles"
import WeaponCard from "./WeaponCard"

function CombatScreen() {
  const useCases = useGetUseCases()
  const character = useCharacter()
  const inventory = useInventory()
  const { status, secAttr, equipedObjects } = character
  const equWeapons = equipedObjects.weapons
  const { currAp } = status
  const maxAp = secAttr.curr.actionPoints
  const weapons = equWeapons.map(eW => inventory.weaponsRecord[eW.dbKey])

  const [prevAp, setPrevAp] = useState(currAp)

  const handleSetPrevAp = (apCost: number) => {
    setPrevAp(apCost)
  }

  const getCheckboxColor = (i: number) => {
    const hasPrevAp = i < prevAp
    const hasCurrAp = i < currAp
    if (hasCurrAp && !hasPrevAp) return colors.yellow
    return colors.secColor
  }

  const handleSetAp = async (i: number) => {
    const newValue = i < currAp ? i : i + 1
    handleSetPrevAp(newValue)
    await useCases.status.updateElement(character, "currAp", newValue)
  }

  const apArr = []
  for (let i = 0; i < maxAp; i += 1) {
    apArr.push(`pa${i}`)
  }

  const visibleWeapons = weapons.length > 0 ? weapons : [character.unarmed]

  return (
    <DrawerPage>
      <View style={{ flex: 1 }}>
        <Section title={`Points d'action : ${currAp} / ${maxAp}`}>
          <List
            data={apArr}
            horizontal
            style={styles.checkboxContainer}
            keyExtractor={item => item}
            renderItem={({ item }) => (
              <CheckBox
                color={getCheckboxColor(Number(item.replace("pa", "")))}
                size={22}
                key={item}
                isChecked={Number(item.replace("pa", "")) < currAp}
                onPress={() => handleSetAp(Number(item.replace("pa", "")))}
              />
            )}
          />
          <Spacer y={5} />
        </Section>

        <ScrollView style={{ borderColor: colors.secColor, borderBottomWidth: 1 }}>
          <Spacer y={15} />

          <List
            data={visibleWeapons}
            keyExtractor={item => item.dbKey}
            separator={<Spacer y={15} />}
            renderItem={({ item }) => <WeaponCard weapon={item} setPrevAp={handleSetPrevAp} />}
          />
        </ScrollView>
      </View>
    </DrawerPage>
  )
}

export default memo(CombatScreen)
