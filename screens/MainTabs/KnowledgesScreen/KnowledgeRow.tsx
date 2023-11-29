import React from "react"
import { View } from "react-native"

import List from "components/List"
import Txt from "components/Txt"
import { KnowledgeLevelId, KnowledgeLevelValue } from "models/character/knowledges/knowledge-types"
import colors from "styles/colors"
import CheckBox from "components/CheckBox/CheckBox"
import knowledges from "models/character/knowledges/knowledges"

const knowledgeLevels = [1, 2, 3, 4, 5, 6]

type KnowledgeRowProps = {
  knowledge: Record<KnowledgeLevelId, KnowledgeLevelValue>
}

export default function KnowledgeRow({ knowledge }: KnowledgeRowProps) {
  return (
    <View
      style={{
        backgroundColor: colors.primColor,
        flexDirection: "row",
        alignItems: "center",
        margin: 0,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderWidth: 0
      }}
    >
      <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
        <Txt>{knowledges[knowledge]}</Txt>
      </View>

      <List
        data={knowledgeLevels}
        keyExtractor={item => item.toString()}
        renderItem={({ item }) => (
          <CheckBox isChecked={}  />
        )}
      />
    </View>
  )
}
