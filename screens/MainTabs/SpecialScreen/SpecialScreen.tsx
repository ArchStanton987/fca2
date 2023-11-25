import React, { useState } from "react"
import { Pressable, ScrollView, View } from "react-native"

import List from "components/List"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import SmallLine from "components/draws/Line/Line"
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
    <>
      <Row
        isHeader
        label="ATTRIBUT"
        values={{ baseValue: "BASE", modValue: "MOD", currValue: "TOT" }}
      />
      {/* <Spacer y={10} /> */}
    </>
  )
}

export default function SpecialScreen() {
  const [selectedId, setSelectedId] = useState<SpecialId | null>(null)

  const baseContext = useBaseAttr()
  const currContext = useCurrAttr()

  if (!baseContext.isReady || !currContext.isReady) return <LoadingScreen />

  return (
    <View style={[styles.drawerPage, { flexDirection: "row" }]}>
      <View style={[styles.container, { flex: 1 }]}>
        <SmallLine top right />
        <ScrollView>
          <List
            data={specialArray}
            keyExtractor={item => item.id}
            // separator={<Spacer y={10} />}
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
      </View>
      <Spacer x={10} />
      <View style={[styles.container, { width: 250 }]}>
        <SmallLine top right />
        <ScrollView>
          <Txt>DESCRIPTION</Txt>
          <Spacer y={10} />
          {selectedId && <Txt>{specialMap[selectedId].description}</Txt>}
        </ScrollView>
      </View>
    </View>
  )
}
