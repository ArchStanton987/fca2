import React from "react"
import { Pressable, ScrollView, View } from "react-native"

import List from "components/List"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import SmallLine from "components/draws/Line/Line"
import specialMap, { specialArray } from "models/character/special/special"
import { useBaseAttr } from "providers/BaseAttrProvider"
import { useCurrAttr } from "providers/CurrAttrProvider"
import LoadingScreen from "screens/LoadingScreen"

import styles from "./SpecialScreen.styles"

type RowProps = {
  label: string
  baseValue: number | string
  modValue: number | string
  currValue: number | string
}

function Row(props: RowProps) {
  const { label, baseValue, modValue, currValue } = props
  return (
    <Pressable style={{ flexDirection: "row", alignItems: "center" }}>
      <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
        <Txt>{label}</Txt>
      </View>
      {[baseValue, modValue, currValue].map((el, i) => (
        <View key={`${el}-${i}`} style={styles.attributeRow}>
          <Txt>{el}</Txt>
        </View>
      ))}
    </Pressable>
  )
}

function Header() {
  return <Row label="ATTRIBUT" baseValue="BASE" modValue="MOD" currValue="TOT" />
}

export default function SpecialScreen() {
  const baseContext = useBaseAttr()
  const currContext = useCurrAttr()

  if (baseContext.baseSpecial === null) return <LoadingScreen />

  return (
    <View style={{ flexDirection: "row" }}>
      <View style={styles.container}>
        <SmallLine top right />
        <ScrollView>
          <List
            data={specialArray}
            keyExtractor={item => item.id}
            separator={<Spacer y={10} />}
            ListHeaderComponent={Header}
            renderItem={({ item }) => {
              const { label } = specialMap[item.id]
              const baseValue = baseContext?.baseSpecial[item.id] || 0
              const modValue = currContext?.modSpecial[item.id] || 0
              const currValue = currContext?.currSpecial[item.id] || 0
              return (
                <Row
                  label={label}
                  baseValue={baseValue}
                  modValue={modValue}
                  currValue={currValue}
                />
              )
            }}
          />
        </ScrollView>
      </View>
    </View>
  )
}
