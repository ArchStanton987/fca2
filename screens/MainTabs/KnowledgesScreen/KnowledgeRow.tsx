import React from "react"
import { View } from "react-native"

import CheckBox from "components/CheckBox/CheckBox"
import List from "components/List"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { KnowledgeId, KnowledgeLevelValue } from "models/character/knowledges/knowledge-types"
import knowledgesMap from "models/character/knowledges/knowledges"
import knowledgeLevels from "models/character/knowledges/knowledges-levels"

import styles from "./KnowledgeRow.styles"

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
  knowledge: {
    id: KnowledgeId
    value: KnowledgeLevelValue
  }
}

export default function KnowledgeRow({ knowledge }: KnowledgeRowProps) {
  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Txt>{knowledgesMap[knowledge.id].label}</Txt>
      </View>
      <List
        horizontal
        data={knowledgeLevels}
        keyExtractor={item => `${knowledge.id}-${item.id}`}
        renderItem={({ item }) => (
          <View style={styles.levelContainer}>
            <CheckBox isChecked={item.id < knowledge.value} />
          </View>
        )}
      />
    </View>
  )
}
