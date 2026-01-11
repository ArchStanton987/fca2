import { router, useLocalSearchParams } from "expo-router"

import {
  KnowledgeId,
  KnowledgeLevelValue
} from "lib/character/abilities/knowledges/knowledge-types"
import KnowledgeRow, {
  ListFooter,
  ListHeader
} from "lib/character/abilities/knowledges/ui/KnowledgeRow"
import { useCurrCharId } from "lib/character/character-store"

import List from "components/List"
import ModalCta from "components/ModalCta/ModalCta"
import ScrollSection from "components/Section/ScrollSection"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import ModalBody from "components/wrappers/ModalBody"
import { useGetUseCases } from "providers/UseCasesProvider"

type Params = {
  squadId: string
  modifiedKnowledges: string
}
type ModifiedKnowledges = Record<KnowledgeId, KnowledgeLevelValue>

export default function UpdateKnowledgesConfirmationModal() {
  const params = useLocalSearchParams<Params>()
  const charId = useCurrCharId()
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
      <ScrollSection style={{ flex: 1 }}>
        <List
          ListHeaderComponent={ListHeader}
          ListFooterComponent={ListFooter}
          data={knowledgesList}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <KnowledgeRow isEditable={false} id={item.id} value={item.value} />
          )}
        />
      </ScrollSection>
      <ModalCta onPressCancel={cancel} onPressConfirm={confirm} />
    </ModalBody>
  )
}
