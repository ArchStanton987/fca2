import { Pressable, ScrollView, View } from "react-native"

import DrawerPage from "components/DrawerPage"
import List from "components/List"
import Section from "components/Section"
import Txt from "components/Txt"
import secAttrMap from "models/character/sec-attr/sec-attr"
import { useBaseAttr } from "providers/BaseAttrProvider"
import { useCurrAttr } from "providers/CurrAttrProvider"
import LoadingScreen from "screens/LoadingScreen"

import styles from "./SecAttrScreen.styles"

const secAttrArray = Object.values(secAttrMap)

type RowProps = {
  label: string
  values: {
    baseValue: number | string
    modValue: number | string
    currValue: number | string
  }
  isSelected?: boolean
  onPress?: () => void
  isHeader?: boolean
}

function Row(props: RowProps) {
  const { label, values, isSelected = false, onPress, isHeader = false } = props
  return (
    <Pressable
      style={[styles.row, isSelected && styles.rowSelected, isHeader && styles.listHeader]}
      onPress={onPress}
      // initAnimColor={colors.terColor}
    >
      <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
        <Txt>{label}</Txt>
      </View>
      {Object.entries(values).map(([key, value]) => (
        <View key={`${label}-${key}`} style={styles.attributeRow}>
          <Txt>{value}</Txt>
        </View>
      ))}
    </Pressable>
  )
}

function Header() {
  return (
    <Row
      isHeader
      label="ATTRIBUT"
      values={{ baseValue: "BASE", modValue: "MOD", currValue: "TOT" }}
    />
  )
}

export default function SecAttrScreen() {
  const baseContext = useBaseAttr()
  const currContext = useCurrAttr()

  if (!baseContext.isReady || !currContext.isReady) return <LoadingScreen />
  return (
    <DrawerPage>
      <Section style={{ flex: 1 }}>
        <ScrollView>
          <List
            data={secAttrArray}
            keyExtractor={item => item.id}
            ListHeaderComponent={Header}
            renderItem={({ item }) => {
              const { label } = secAttrMap[item.id]
              const baseValue = baseContext.baseSecAttr[item.id]
              const modValue = currContext.modSecAttr[item.id]
              const currValue = currContext.currSecAttr[item.id]
              return <Row label={label} values={{ baseValue, modValue, currValue }} />
            }}
          />
        </ScrollView>
      </Section>
    </DrawerPage>
  )
}
