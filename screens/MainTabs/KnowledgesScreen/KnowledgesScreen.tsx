import React from "react"
import { View } from "react-native"

import { useLocalSearchParams } from "expo-router"

import { FlatList } from "react-native-gesture-handler"

import { DrawerParams } from "components/Drawer/Drawer.params"
import DrawerPage from "components/DrawerPage"
import Section from "components/Section"
import Txt from "components/Txt"
import useGetKnowledges from "hooks/db/useGetKnowledges"
import LoadingScreen from "screens/LoadingScreen"
import KnowledgeRow from "screens/MainTabs/KnowledgesScreen/KnowledgeRow"
import { SearchParams } from "screens/ScreenParams"

export default function KnowledgesScreen() {
  const { charId } = useLocalSearchParams() as SearchParams<DrawerParams>
  const knowledges = useGetKnowledges(charId)

  if (!knowledges) return <LoadingScreen />

  const knowledgesArray = Object.entries(knowledges).map(([id, value]) => ({ id, value }))

  return (
    <DrawerPage>
      <Section style={{ flex: 1 }}>
        <FlatList
          data={knowledgesArray}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <KnowledgeRow knowledge={item} />}
        />
      </Section>
    </DrawerPage>
  )
}
