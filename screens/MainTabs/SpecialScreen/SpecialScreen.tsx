import React, { useState } from "react"
import { Pressable, ScrollView, View } from "react-native"

import DrawerPage from "components/DrawerPage"
import List from "components/List"
import Section from "components/Section"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import specialMap, { specialArray } from "models/character/special/special"
import { SpecialId } from "models/character/special/special-types"
import { useBaseAttr } from "providers/BaseAttrProvider"
import { useCurrAttr } from "providers/CurrAttrProvider"
import LoadingScreen from "screens/LoadingScreen"

import styles from "./SpecialScreen.styles"

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

export default function SpecialScreen() {
  const [selectedId, setSelectedId] = useState<SpecialId | null>(null)

  const baseContext = useBaseAttr()
  const currContext = useCurrAttr()

  if (!baseContext.isReady || !currContext.isReady) return <LoadingScreen />

  return (
    <DrawerPage style={{ flexDirection: "row" }}>
      <Section style={{ flex: 1 }}>
        <ScrollView>
          <List
            data={specialArray}
            keyExtractor={item => item.id}
            ListHeaderComponent={Header}
            renderItem={({ item }) => {
              const { label } = specialMap[item.id]
              const baseValue = baseContext.baseSpecial[item.id]
              const modValue = currContext.modSpecial[item.id]
              const currValue = currContext.currSpecial[item.id]
              return (
                <Row
                  label={label}
                  values={{ baseValue, modValue, currValue }}
                  isSelected={selectedId === item.id}
                  onPress={() => setSelectedId(item.id)}
                />
              )
            }}
          />
        </ScrollView>
      </Section>
      <Spacer x={10} />
      <Section style={{ width: 250 }}>
        <ScrollView>
          <Txt>DESCRIPTION</Txt>
          <Spacer y={10} />
          {selectedId && <Txt>{specialMap[selectedId].description}</Txt>}
        </ScrollView>
      </Section>
    </DrawerPage>
  )
}
