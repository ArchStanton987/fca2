import { StyleSheet, View } from "react-native"

import { useAbilities } from "lib/character/abilities/abilities-provider"
import { useCarry, useClothings, useMiscObjects, useWeapons } from "lib/inventory/use-sub-inv-cat"

import List from "components/List"
import Section from "components/Section"
import ScrollSection from "components/Section/ScrollSection"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import layout from "styles/layout"

import { getPlaceColor, getWeightColor } from "./EquipedObjSection.utils"

const styles = StyleSheet.create({
  equObjRow: {
    flexDirection: "row",
    justifyContent: "space-between"
  }
})

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
function MiscListHeader() {
  return (
    <>
      <Txt>DIVERS :</Txt>
      <Spacer y={5} />
    </>
  )
}

export default function EquipedObjSection({ charId }: { charId: string }) {
  const { data: currSecAttr } = useAbilities(charId, a => a.secAttr.curr)
  const { normalCarryWeight, tempCarryWeight, maxCarryWeight, maxPlace } = currSecAttr
  const { data: equippedWeapons } = useWeapons(charId, { isEquipped: true })
  const { data: equippedClothings } = useClothings(charId, true)
  const { data: equippedMisc } = useMiscObjects(charId, true)
  const { weight, place } = useCarry(charId)

  return (
    <View style={{ flex: 1 }}>
      <Section title="charge">
        <View style={styles.equObjRow}>
          <Txt style={{ color: getWeightColor(weight, currSecAttr) }}>POIDS: {weight}</Txt>
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
          data={Object.values(equippedWeapons)}
          ListHeaderComponent={WeaponsListHeader}
          keyExtractor={item => item.dbKey}
          renderItem={({ item }) => (
            <View style={styles.equObjRow}>
              <Txt>- {item.data.label}</Txt>
            </View>
          )}
        />

        <Spacer y={layout.globalPadding} />

        <List
          data={Object.values(equippedClothings)}
          ListHeaderComponent={ClothingsListHeader}
          keyExtractor={item => item.dbKey}
          renderItem={({ item }) => (
            <View style={styles.equObjRow}>
              <Txt>- {item.data.label}</Txt>
            </View>
          )}
        />
        <Spacer y={layout.globalPadding} />

        <List
          data={Object.values(equippedMisc)}
          ListHeaderComponent={MiscListHeader}
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
