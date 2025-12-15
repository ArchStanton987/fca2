import { ScrollView, View } from "react-native"

import { sortKnowledges, useKnowledges } from "lib/character/abilities/abilities-provider"
import { KnowledgeId } from "lib/character/abilities/knowledges/knowledge-types"
import KnowledgeRow, { ListHeader } from "lib/character/abilities/knowledges/ui/KnowledgeRow"
import { useCurrCharId } from "lib/character/character-store"

import DrawerPage from "components/DrawerPage"
import List from "components/List"
import { ComposedTitleProps } from "components/Section/Section.types"
import SectionTopRow from "components/Section/SectionTopRow"
import Spacer from "components/Spacer"
import SmallLine from "components/draws/Line/Line"
import colors from "styles/colors"
import layout from "styles/layout"

const title: ComposedTitleProps = [
  { title: "connaissance", containerStyle: { flex: 1 } },
  { title: "niveaux", containerStyle: { flex: 1 } }
]

export default function KnowledgesScreen() {
  const charId = useCurrCharId()
  const { data: knowledges } = useKnowledges(charId)
  const list = sortKnowledges(knowledges)

  return (
    <DrawerPage>
      <View style={{ flex: 1, borderBottomWidth: 1, borderColor: colors.secColor }}>
        <SectionTopRow title={title} />
        <Spacer y={5} />
        <ListHeader />
        <ScrollView>
          <List
            data={list}
            keyExtractor={k => k.id}
            renderItem={({ item }) => (
              <KnowledgeRow isEditable={false} id={item.id as KnowledgeId} value={item.value} />
            )}
          />
          <Spacer y={layout.smallLineHeight} />
        </ScrollView>
        <SmallLine bottom right />
        <SmallLine bottom left />
      </View>
    </DrawerPage>
  )
}
