import { View } from "react-native"

import { router } from "expo-router"

import { useCurrCharId } from "lib/character/character-store"
import {
  useUpdateEffects,
  useUpdateEffectsAction
} from "lib/character/effects/update-effects-store"

import List from "components/List"
import ModalCta from "components/ModalCta/ModalCta"
import ScrollSection from "components/Section/ScrollSection"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import ModalBody from "components/wrappers/ModalBody"
import { useCollectiblesData } from "providers/AdditionalElementsProvider"
import { useGetUseCases } from "providers/UseCasesProvider"

export default function EffectsConfirmationModal() {
  const charId = useCurrCharId()

  const { effects } = useCollectiblesData()

  const actions = useUpdateEffectsAction()
  const newEffects = useUpdateEffects(state => state.newEffects)

  const useCases = useGetUseCases()

  const onPressConfirm = async () => {
    const promises = newEffects.map(e => useCases.character.addEffect({ charId, effectId: e }))
    await Promise.all(promises)
    actions.reset()
    router.dismiss(2)
  }

  return (
    <ModalBody>
      <Spacer y={10} />
      <Txt style={{ textAlign: "center" }}>
        Vous êtes sur le point d&apos;effectuer les modifications suivantes :
      </Txt>
      <Spacer y={15} />
      <ScrollSection title="EFFETS" style={{ flex: 1, width: 300, alignSelf: "center" }}>
        <List
          data={newEffects}
          keyExtractor={e => e}
          renderItem={({ item }) => (
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Txt>{effects[item].label}</Txt>
              <Txt>x1</Txt>
            </View>
          )}
        />
      </ScrollSection>
      <Spacer y={10} />
      <ModalCta onPressConfirm={onPressConfirm} />
    </ModalBody>
  )
}
