import React from "react"
import { View } from "react-native"

import useCases from "lib/common/use-cases"
import { CharStackScreenProps } from "nav/nav.types"

import ModalCta from "components/ModalCta/ModalCta"
import ScrollableSection from "components/ScrollableSection"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import ModalBody from "components/wrappers/ModalBody"
import { useCharacter } from "contexts/CharacterContext"
import { useUpdateHealth } from "contexts/UpdateHealthContext"

export default function UpdateHealthConfirmationModal({
  navigation
}: CharStackScreenProps<"UpdateHealthConfirmation">) {
  const character = useCharacter()

  const { state, dispatch } = useUpdateHealth()

  const updates = Object.entries(state)
    .filter(([, value]) => ("count" in value ? value.count !== 0 : false))
    .map(([id, content]) => ({ id, ...content }))

  const onPressConfirm = async () => {
    await useCases.status.groupMod(character, state)
    dispatch({ type: "reset" })
    navigation.popToTop()
  }
  return (
    <ModalBody>
      <Spacer y={30} />
      <Txt style={{ textAlign: "center" }}>
        Vous êtes sur le point d&apos;effectuer les modifications suivantes :
      </Txt>
      <Spacer y={30} />
      <ScrollableSection title="SANTE" style={{ flex: 1, width: 300, alignSelf: "center" }}>
        {updates.map(healthUpdate => (
          <View
            key={healthUpdate.id}
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Txt>{healthUpdate.label}</Txt>
            <Txt>{healthUpdate.count}</Txt>
          </View>
        ))}
      </ScrollableSection>
      <Spacer y={15} />
      <ModalCta onPressConfirm={onPressConfirm} />
    </ModalBody>
  )
}
