import { View } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import {
  useUpdateEffects,
  useUpdateEffectsAction
} from "lib/character/effects/update-effects-store"

import List from "components/List"
import ModalCta from "components/ModalCta/ModalCta"
import ScrollableSection from "components/ScrollableSection"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import ModalBody from "components/wrappers/ModalBody"
import { useCollectiblesData } from "providers/AdditionalElementsProvider"
import { useGetUseCases } from "providers/UseCasesProvider"

export default function EffectsConfirmationModal() {
  const { charId } = useLocalSearchParams<{ charId: string }>()

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
      <Spacer y={30} />
      <Txt style={{ textAlign: "center" }}>
        Vous êtes sur le point d&apos;effectuer les modifications suivantes :
      </Txt>
      <Spacer y={30} />
      <ScrollableSection title="EFFETS" style={{ flex: 1, width: 300, alignSelf: "center" }}>
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
      </ScrollableSection>
      <Spacer y={15} />
      <ModalCta onPressConfirm={onPressConfirm} />
    </ModalBody>
  )
}
