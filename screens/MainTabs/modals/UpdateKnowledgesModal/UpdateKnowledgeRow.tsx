import React from "react"
import { View } from "react-native"

import {
  KnowledgeId,
  KnowledgeLevel,
  KnowledgeLevelValue
} from "lib/character/abilities/knowledges/knowledge-types"
import knowledgesMap from "lib/character/abilities/knowledges/knowledges"
import knowledgeLevels from "lib/character/abilities/knowledges/knowledges-levels"

import CheckBox from "components/CheckBox/CheckBox"
import List from "components/List"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import colors from "styles/colors"

import styles from "../../../../lib/character/abilities/knowledges/ui/KnowledgeRow.styles"

export function ListFooter() {
  return <Spacer y={10} />
}

export function ListHeader() {
  return (
    <View>
      <View style={styles.container}>
        <View style={styles.labelContainer}>
          <Txt>CONNAISSANCE</Txt>
          <Spacer fullspace />
          <Txt>BONUS</Txt>
        </View>
        <List
          horizontal
          data={knowledgeLevels}
          keyExtractor={item => `header-${item.id.toString()}`}
          renderItem={({ item }) => (
            <View style={styles.levelContainer}>
              <Txt>{item.bonusLabel}</Txt>
            </View>
          )}
        />
      </View>
      <View style={styles.container}>
        <View style={styles.labelContainer}>
          <Spacer fullspace />
          <Txt>COUT LVL</Txt>
        </View>
        <List
          horizontal
          data={knowledgeLevels}
          keyExtractor={item => `header-${item.id.toString()}`}
          renderItem={({ item }) => (
            <View style={styles.levelContainer}>
              <Txt>{item.cost}</Txt>
            </View>
          )}
        />
      </View>
      <Spacer y={5} />
    </View>
  )
}

type KnowledgeRowProps = {
  id: KnowledgeId
  initValue: KnowledgeLevelValue | 0
  currValue: KnowledgeLevelValue | 0
  availablePoints: number
  onPress: (id: KnowledgeId, level: KnowledgeLevel) => void
}

export default function UpdateKnowledgeRow({
  id,
  initValue,
  currValue,
  availablePoints,
  onPress
}: KnowledgeRowProps) {
  const currLvlCost = knowledgeLevels.find(lvl => lvl.id === currValue)?.cost ?? 0
  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Txt>{knowledgesMap[id].label}</Txt>
      </View>
      <List
        horizontal
        data={knowledgeLevels}
        keyExtractor={item => `${id}-${item.id}`}
        renderItem={({ item }) => {
          const updateCost = item.cost - currLvlCost
          const isAffordable = availablePoints >= updateCost
          const isBought = item.id <= initValue
          const isAdded = item.id <= currValue
          const isDisabled = !isAffordable || isBought
          return (
            <View style={styles.levelContainer}>
              <CheckBox
                disabled={isDisabled}
                onPress={() => onPress(id, item)}
                isChecked={isAdded}
                color={isDisabled ? colors.quadColor : colors.secColor}
              />
            </View>
          )
        }}
      />
    </View>
  )
}
