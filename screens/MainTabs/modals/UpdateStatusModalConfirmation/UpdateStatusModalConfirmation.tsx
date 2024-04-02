import { View } from "react-native"

import { router } from "expo-router"
import { useLocalSearchParams } from "expo-router/src/hooks"

import ModalCta from "components/ModalCta/ModalCta"
import ScrollableSection from "components/ScrollableSection"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import ModalBody from "components/wrappers/ModalBody"
import { useCharacter } from "contexts/CharacterContext"
import ScreenParams from "screens/ScreenParams"

export default function UpdateStatusConfirmationModal() {
  const character = useCharacter()
  const localParams = useLocalSearchParams()
  const { squadId, charId } = ScreenParams.fromLocalParams(localParams)
  const updates = JSON.parse(localParams.updates)

  const onPressConfirm = async () => {
    await character.updateStatus(updates)
    router.back()
  }

  return (
    <ModalBody>
      <Spacer y={30} />
      <Txt style={{ textAlign: "center" }}>
        Vous êtes sur le point d&apos;effectuer les modifications suivantes :
      </Txt>
      <Spacer y={30} />
      <ScrollableSection title="STATUS" style={{ flex: 1, width: 300, alignSelf: "center" }}>
        {Object.entries(updates).map(([id, value]) => (
          <View key={id} style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Txt>{id}</Txt>
            <Txt>{value}</Txt>
          </View>
        ))}
      </ScrollableSection>
      <Spacer y={15} />
      <ModalCta onPressConfirm={onPressConfirm} />
    </ModalBody>
  )
}
