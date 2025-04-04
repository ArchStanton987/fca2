import React, { memo, useEffect, useState } from "react"
import { ScrollView, View } from "react-native"

import { router } from "expo-router"

import CheckBox from "components/CheckBox/CheckBox"
import DrawerPage from "components/DrawerPage"
import List from "components/List"
import Section from "components/Section"
import Spacer from "components/Spacer"
import routes from "constants/routes"
import { useCharacter } from "contexts/CharacterContext"
import { useInventory } from "contexts/InventoryContext"
import useRtdbSub from "hooks/db/useRtdbSub"
import { useGetUseCases } from "providers/UseCasesProvider"
import colors from "styles/colors"

import styles from "./CombatScreen.styles"
import WeaponCard from "./WeaponCard"

function CombatScreen() {
  const useCases = useGetUseCases()
  const character = useCharacter()
  const inventory = useInventory()
  const { status, secAttr, equipedObjects, charId } = character
  const equWeapons = equipedObjects.weapons
  const { currAp, currentCombatId = "none" } = status
  const maxAp = secAttr.curr.actionPoints
  const weapons = equWeapons.map(eW => inventory.weaponsRecord[eW.dbKey])
  const combat = useRtdbSub(useCases.combat.sub({ id: currentCombatId }))

  const shouldRollInitiative = combat && combat.players[charId].initiative === 1000

  useEffect(() => {
    if (shouldRollInitiative) {
      router.push({
        pathname: routes.modal.initiative,
        params: { charId, combatId: currentCombatId, charType: "players" }
      })
    }
  }, [charId, currentCombatId, shouldRollInitiative])

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
          <View style={styles.checkboxContainer}>
            {apArr.map((ap, i) => (
              <CheckBox
                color={getCheckboxColor(i)}
                size={22}
                key={ap}
                isChecked={i < currAp}
                onPress={() => handleSetAp(i)}
              />
            ))}
          </View>
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
