import { memo } from "react"
import { FlatList } from "react-native"

import DrawerPage from "components/DrawerPage"
import Section from "components/Section"
import { useCharacter } from "contexts/CharacterContext"
import KnowledgeRow, {
  ListFooter,
  ListHeader
} from "screens/MainTabs/KnowledgesScreen/KnowledgeRow"

function KnowledgesScreen() {
  const { knowledges } = useCharacter()

  return (
    <DrawerPage>
      <Section style={{ flex: 1 }}>
        <FlatList
          ListHeaderComponent={ListHeader}
          stickyHeaderIndices={[0]}
          ListFooterComponent={ListFooter}
          data={knowledges}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <KnowledgeRow isEditable={false} knowledge={item} />}
        />
      </Section>
    </DrawerPage>
  )
}

export default memo(KnowledgesScreen)
