import { View } from "react-native"

import effectsMap from "lib/character/effects/effects"
import { EffectId } from "lib/character/effects/effects.types"
import useCases from "lib/common/use-cases"
import { CharStackScreenProps } from "nav/nav.types"

import ModalCta from "components/ModalCta/ModalCta"
import ScrollableSection from "components/ScrollableSection"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import ModalBody from "components/wrappers/ModalBody"
import { useCharacter } from "contexts/CharacterContext"

export default function EffectsConfirmationModal({
  route,
  navigation
}: CharStackScreenProps<"UpdateEffectsConfirmation">) {
  const character = useCharacter()
  const { effectsToAdd } = route.params

  const onPressConfirm = async () => {
    await useCases.effects.groupAdd(
      character,
      effectsToAdd.map(effectId => ({ effectId, startDate: character.date }))
    )
    navigation.popToTop()
  }

  return (
    <ModalBody>
      <Spacer y={30} />
      <Txt style={{ textAlign: "center" }}>
        Vous êtes sur le point d&apos;effectuer les modifications suivantes :
      </Txt>
      <Spacer y={30} />
      <ScrollableSection title="EFFETS" style={{ flex: 1, width: 300, alignSelf: "center" }}>
        {effectsToAdd.map(effect => (
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
