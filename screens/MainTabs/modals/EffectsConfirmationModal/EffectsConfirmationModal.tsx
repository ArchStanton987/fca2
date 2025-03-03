import { View } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import effectsMap from "lib/character/effects/effects"
import { EffectId } from "lib/character/effects/effects.types"

import { DrawerParams } from "components/Drawer/Drawer.params"
import ModalCta from "components/ModalCta/ModalCta"
import ScrollableSection from "components/ScrollableSection"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import ModalBody from "components/wrappers/ModalBody"
import { useCharacter } from "contexts/CharacterContext"
import { useGetUseCases } from "providers/UseCasesProvider"

type EffectConfirmationModalParams = DrawerParams & {
  effectsToAdd?: string
}

export default function EffectsConfirmationModal() {
  const useCases = useGetUseCases()
  const character = useCharacter()
  const { effectsToAdd } = useLocalSearchParams<EffectConfirmationModalParams>()
  let effects: EffectId[] = []
  if (effectsToAdd) {
    effects = effectsToAdd.split(",") as EffectId[]
  }

  const onPressConfirm = async () => {
    await useCases.effects.groupAdd(
      character,
      effects.map(effect => ({ effectId: effect, startDate: character.date }))
    )
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
        {effects.map(effect => (
          <View key={effect} style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Txt>{effectsMap[effect as EffectId].label}</Txt>
            <Txt>x1</Txt>
          </View>
        ))}
      </ScrollableSection>
      <Spacer y={15} />
      <ModalCta onPressConfirm={onPressConfirm} />
    </ModalBody>
  )
}
