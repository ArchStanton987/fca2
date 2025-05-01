import { useEffect } from "react"
import { ActivityIndicator, View } from "react-native"

import { router } from "expo-router"

import { getInitiativePrompts } from "lib/combat/utils/combat-utils"

import Spacer from "components/Spacer"
import Txt from "components/Txt"
import ModalBody from "components/wrappers/ModalBody"
import { useCharacter } from "contexts/CharacterContext"
import { useCombat } from "providers/CombatProvider"
import colors from "styles/colors"

export default function WaitOtherInitiativeModal() {
  const { players, npcs } = useCombat()
  const { charId } = useCharacter()

  const { shouldWaitOthers } = getInitiativePrompts(charId, players ?? {}, npcs ?? {})

  useEffect(() => {
    if (!shouldWaitOthers) {
      router.dismiss()
    }
  }, [shouldWaitOthers])

  return (
    <ModalBody>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.secColor} />
        <Spacer y={40} />
        <Txt>En attente des jets d&apos;initiative des autres joueurs...</Txt>
      </View>
    </ModalBody>
  )
}
