import { View } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import effectsMap from "lib/character/effects/effects"
import { EffectId } from "lib/character/effects/effects.types"

import { DrawerParams } from "components/Drawer/Drawer.params"
import ModalCta from "components/ModalCta/ModalCta"
import ScrollableSection from "components/ScrollableSection"
import Txt from "components/Txt"
import routes from "constants/routes"
import { useCharacter } from "contexts/CharacterContext"

type EffectConfirmationModalParams = DrawerParams & {
  effectsToAdd?: string
}

export default function EffectsConfirmationModal() {
  const character = useCharacter()
  const { squadId, charId, effectsToAdd } = useLocalSearchParams<EffectConfirmationModalParams>()
  let effects: EffectId[] = []
  if (effectsToAdd) {
    effects = effectsToAdd.split(",") as EffectId[]
  }

  const onPressConfirm = () => {
    character.groupAddEffects(effects)
    router.push({ pathname: routes.main.effects, params: { squadId, charId } })
  }

  return (
    <View style={{ padding: 10, flex: 1 }}>
      <Txt>ConfirmationModal</Txt>
      <ScrollableSection title="EFFETS" style={{ width: 400, alignSelf: "center" }}>
        {effects.map(effect => (
          <View key={effect} style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Txt>{effectsMap[effect as EffectId].label}</Txt>
            <Txt>x1</Txt>
          </View>
        ))}
      </ScrollableSection>
      <ModalCta onPressConfirm={onPressConfirm} />
    </View>
  )
}
