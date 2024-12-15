import { memo } from "react"
import { ScrollView, View } from "react-native"

import DrawerPage from "components/DrawerPage"
import { ComposedTitleProps } from "components/Section/Section.types"
import SectionTopRow from "components/Section/SectionTopRow"
import Spacer from "components/Spacer"
import SmallLine from "components/draws/Line/Line"
import { useCharacter } from "contexts/CharacterContext"
import KnowledgeRow, { ListHeader } from "screens/MainTabs/KnowledgesScreen/KnowledgeRow"
import colors from "styles/colors"
import layout from "styles/layout"

const title: ComposedTitleProps = [
  { title: "connaissance", containerStyle: { flex: 1 } },
  { title: "niveaux", containerStyle: { flex: 1 } }
]

function KnowledgesScreen() {
  const { knowledges } = useCharacter()

  return (
    <DrawerPage>
      <View style={{ flex: 1, borderBottomWidth: 1, borderColor: colors.secColor }}>
        <SectionTopRow title={title} />
        <Spacer y={5} />
        <ListHeader />
        <ScrollView>
          {knowledges.map(knowledge => (
            <KnowledgeRow isEditable={false} knowledge={knowledge} key={knowledge.id} />
          ))}
          <Spacer y={layout.smallLineHeight} />
        </ScrollView>
        <SmallLine bottom right />
        <SmallLine bottom left />
      </View>
    </DrawerPage>
  )
}

export default memo(KnowledgesScreen)
