import { View } from "react-native"

import { useLocalSearchParams } from "expo-router"

import { useAbilities } from "lib/character/abilities/abilities-provider"
import { useCarry, useClothings, useWeapons } from "lib/inventory/use-sub-inv-cat"
import { observer } from "mobx-react-lite"

import List from "components/List"
import Section from "components/Section"
import ScrollSection from "components/Section/ScrollSection"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
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
  const { charId } = useLocalSearchParams<{ charId: string }>()
  const { secAttr } = useAbilities()
  const { normalCarryWeight, tempCarryWeight, maxCarryWeight, maxPlace } = secAttr.curr
  const equipedWeapons = useWeapons(charId, true)
  const equipedClothings = useClothings(charId, true)
  const { weight, place } = useCarry(charId).data

  return (
    <View style={{ flex: 1 }}>
      <Section title="charge">
        <View style={styles.equObjRow}>
          <Txt style={{ color: getWeightColor(weight, secAttr.curr) }}>POIDS: {weight}</Txt>
          <Txt>{`(${normalCarryWeight}/${tempCarryWeight}/${maxCarryWeight})`}</Txt>
        </View>
        <Spacer y={10} />
        <View style={styles.equObjRow}>
          <Txt style={{ color: getPlaceColor(place, maxPlace) }}>PLACE: {place}</Txt>
          <Txt>/{maxPlace || "-"}</Txt>
        </View>
      </Section>

      <Spacer y={layout.globalPadding} />

      <ScrollSection title="équipement" style={{ flex: 1 }}>
        <List
          data={Object.values(equipedWeapons)}
          ListHeaderComponent={WeaponsListHeader}
          keyExtractor={item => item.dbKey}
          renderItem={({ item }) => (
            <View style={styles.equObjRow}>
              <Txt>- {item.data.label}</Txt>
            </View>
          )}
        />

        <Spacer y={10} />

        <List
          data={Object.values(equipedClothings)}
          ListHeaderComponent={ClothingsListHeader}
          keyExtractor={item => item.dbKey}
          renderItem={({ item }) => (
            <View style={styles.equObjRow}>
              <Txt>- {item.data.label}</Txt>
            </View>
          )}
        />
      </ScrollSection>
    </View>
  )
}

export default observer(EquipedObjSection)
