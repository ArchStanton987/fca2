import React from "react"
import { Pressable, View } from "react-native"

import { ScrollView } from "react-native-gesture-handler"

import DrawerPage from "components/DrawerPage"
import List from "components/List"
import Section from "components/Section"
import Txt from "components/Txt"
import skillsMap from "models/character/skills/skills"
import { useBaseAttr } from "providers/BaseAttrProvider"
import { useCurrAttr } from "providers/CurrAttrProvider"
import LoadingScreen from "screens/LoadingScreen"

import styles from "./SkillsScreen.styles"

const skillsArray = Object.values(skillsMap)

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

export default function SkillsScreen() {
  const baseContext = useBaseAttr()
  const currContext = useCurrAttr()

  if (!baseContext.isReady || !currContext.isReady) return <LoadingScreen />
  return (
    <DrawerPage>
      <Section style={{ flex: 1 }}>
        <ScrollView>
          <List
            data={skillsArray}
            keyExtractor={item => item.id}
            ListHeaderComponent={Header}
            renderItem={({ item }) => {
              const { label } = skillsMap[item.id]
              const baseValue = baseContext.baseSkills[item.id]
              const modValue = currContext.modSkills[item.id]
              const currValue = currContext.currSkills[item.id]
              return <Row label={label} values={{ baseValue, modValue, currValue }} />
            }}
          />
        </ScrollView>
      </Section>
    </DrawerPage>
  )
}
