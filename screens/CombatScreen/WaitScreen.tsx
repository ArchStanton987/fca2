import { TouchableHighlight } from "react-native"

import DrawerPage from "components/DrawerPage"
import Section from "components/Section"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"
import { useCombat } from "providers/CombatProvider"
import { useGetUseCases } from "providers/UseCasesProvider"
import colors from "styles/colors"
import layout from "styles/layout"

export default function WaitScreen() {
  const useCases = useGetUseCases()
  const { combat } = useCombat()
  const character = useCharacter()

  const onPressEnd = () => {
    if (!combat) return
    useCases.combat.endWait({ combat, actor: character })
  }

  return (
    <DrawerPage>
      <Section style={{ flex: 1 }}>
        <Txt>Vous avez choisi d&apos;attendre le bon moment pour agir au cours de ce round.</Txt>
        <Spacer y={layout.globalPadding} />
        <Txt>Vous pouvez intervenir quand vous le souhaitez au cours du round.</Txt>
        <Spacer y={layout.globalPadding} />
        <Txt>Pour cela il faut appuyer là :</Txt>
        <Spacer y={layout.globalPadding} />
        <TouchableHighlight
          style={{ borderWidth: 2, borderColor: colors.secColor }}
          onPress={onPressEnd}
        >
          <Txt>ACTION</Txt>
        </TouchableHighlight>
      </Section>
    </DrawerPage>
  )
}
