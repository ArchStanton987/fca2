import React from "react"

import { useLocalSearchParams } from "expo-router"

import { FlatList } from "react-native-gesture-handler"

import { DrawerParams } from "components/Drawer/Drawer.params"
import DrawerPage from "components/DrawerPage"
import Section from "components/Section"
import useGetKnowledges from "hooks/db/useGetKnowledges"
import { KnowledgeId } from "models/character/knowledges/knowledge-types"
import LoadingScreen from "screens/LoadingScreen"
import KnowledgeRow, {
  ListFooter,
  ListHeader
} from "screens/MainTabs/KnowledgesScreen/KnowledgeRow"
import { SearchParams } from "screens/ScreenParams"

export default function KnowledgesScreen() {
  const { charId } = useLocalSearchParams() as SearchParams<DrawerParams>
  const knowledges = useGetKnowledges(charId)

  if (!knowledges) return <LoadingScreen />

  const knowledgesArray = Object.entries(knowledges)
    .map(([id, value]) => ({
      id: id as KnowledgeId,
      value
    }))
    .sort((a, b) => b.value - a.value)

  return (
    <DrawerPage>
      <Section style={{ flex: 1 }}>
        <FlatList
          ListHeaderComponent={ListHeader}
          stickyHeaderIndices={[0]}
          ListFooterComponent={ListFooter}
          data={knowledgesArray}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <KnowledgeRow knowledge={item} />}
        />
      </Section>
    </DrawerPage>
  )
}
