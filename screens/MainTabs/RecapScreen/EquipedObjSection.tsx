import { View } from "react-native"

import { observer } from "mobx-react-lite"

import List from "components/List"
import Section from "components/Section"
import ScrollSection from "components/Section/ScrollSection"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"
import { useInventory } from "contexts/InventoryContext"
import layout from "styles/layout"

import { getPlaceColor, getWeightColor } from "./EquipedObjSection.utils"
import styles from "./RecapScreen.styles"

function WeaponsListHeader() {
  return (
    <>
      <Txt>ARMES :</Txt>
      <Spacer y={5} />
    </>
  )
}
function ClothingsListHeader() {
  return (
    <>
      <Txt>ARMURES :</Txt>
      <Spacer y={5} />
    </>
  )
}

function EquipedObjSection() {
  const character = useCharacter()
  const inventory = useInventory()
  const { equipedObjects, secAttr } = character
  const { normalCarryWeight, tempCarryWeight, maxCarryWeight, maxPlace } = secAttr.curr
  const { weapons, clothings } = equipedObjects
  const { currPlace, currWeight } = inventory.currentCarry

  return (
    <View style={{ flex: 1 }}>
      <Section title="charge">
        <View style={styles.equObjRow}>
          <Txt style={{ color: getWeightColor(currWeight, secAttr.curr) }}>POIDS: {currWeight}</Txt>
          <Txt>{`(${normalCarryWeight}/${tempCarryWeight}/${maxCarryWeight})`}</Txt>
        </View>
        <Spacer y={10} />
        <View style={styles.equObjRow}>
          <Txt style={{ color: getPlaceColor(currPlace, maxPlace) }}>PLACE: {currPlace}</Txt>
          <Txt>/{maxPlace || "-"}</Txt>
        </View>
      </Section>

      <Spacer y={layout.globalPadding} />

      <ScrollSection title="équipement" style={{ flex: 1 }}>
        {weapons.length > 0 ? (
          <List
            data={weapons.map(({ id, inMagazine, dbKey, data }) => ({
              id,
              inMagazine,
              dbKey,
              data
            }))}
            ListHeaderComponent={WeaponsListHeader}
            keyExtractor={item => item.dbKey}
            renderItem={({ item }) => (
              <View style={styles.equObjRow}>
                <Txt>- {item.data.label}</Txt>
              </View>
            )}
          />
        ) : null}

        {clothings.length > 0 ? (
          <List
            data={clothings}
            ListHeaderComponent={ClothingsListHeader}
            keyExtractor={item => item.dbKey}
            renderItem={({ item }) => (
              <View style={styles.equObjRow}>
                <Txt>- {item.data.label}</Txt>
              </View>
            )}
          />
        ) : null}
      </ScrollSection>
    </View>
  )
}

export default observer(EquipedObjSection)
