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
      <Section
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Txt>Vous avez choisi d&apos;attendre le bon moment pour agir au cours de ce round.</Txt>
        <Spacer y={layout.globalPadding} />
        <Txt>Vous pouvez intervenir quand vous le souhaitez au cours du round.</Txt>
        <Spacer y={layout.globalPadding} />
        <Txt>Pour cela il faut prévenir le MJ, puis appuyer là :</Txt>
        <Spacer y={30} />
        <TouchableHighlight
          style={{
            borderWidth: 2,
            backgroundColor: colors.secColor,
            paddingVertical: 15,
            paddingHorizontal: 20
          }}
          onPress={onPressEnd}
        >
          <Txt style={{ color: colors.primColor }}>ACTION</Txt>
        </TouchableHighlight>
      </Section>
    </DrawerPage>
  )
}
