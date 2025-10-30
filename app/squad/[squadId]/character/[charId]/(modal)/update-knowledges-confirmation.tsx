import { FlatList } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import {
  KnowledgeId,
  KnowledgeLevelValue
} from "lib/character/abilities/knowledges/knowledge-types"
import KnowledgeRow, {
  ListFooter,
  ListHeader
} from "lib/character/abilities/knowledges/ui/KnowledgeRow"

import ModalCta from "components/ModalCta/ModalCta"
import Section from "components/Section"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import ModalBody from "components/wrappers/ModalBody"
import { useGetUseCases } from "providers/UseCasesProvider"

type Params = {
  charId: string
  squadId: string
  modifiedKnowledges: string
}
type ModifiedKnowledges = Record<KnowledgeId, KnowledgeLevelValue>

export default function UpdateKnowledgesConfirmationModal() {
  const params = useLocalSearchParams<Params>()
  const { charId } = params
  const useCases = useGetUseCases()
  const modifiedKnowledges = (JSON.parse(params.modifiedKnowledges) ?? {}) as ModifiedKnowledges

  const knowledgesList = Object.entries(modifiedKnowledges).map(
    ([id, value]) => ({ id, value } as { id: KnowledgeId; value: KnowledgeLevelValue })
  )

  const cancel = () => router.dismiss(1)
  const confirm = async () => {
    if (Object.keys(modifiedKnowledges).length === 0) {
      throw new Error("No modified knowledges")
    }
    await useCases.character.updateKnowledges({ charId, newKnowledges: modifiedKnowledges })
    router.dismiss(2)
  }

  return (
    <ModalBody>
      <Txt style={{ textAlign: "center" }}>
        Vous êtes sur le point d&apos;effectuer les modifications suivantes :
      </Txt>
      <Spacer y={20} />
      <Section style={{ flex: 1 }}>
        <FlatList
          ListHeaderComponent={ListHeader}
          stickyHeaderIndices={[0]}
          ListFooterComponent={ListFooter}
          data={knowledgesList}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <KnowledgeRow isEditable={false} knowledge={item} />}
        />
      </Section>
      <ModalCta onPressCancel={cancel} onPressConfirm={confirm} />
    </ModalBody>
  )
}
