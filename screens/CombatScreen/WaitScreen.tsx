import { TouchableHighlight } from "react-native"

import { useCombatId } from "lib/character/combat-status/combat-status-provider"
import { useCombatState } from "lib/combat/use-cases/sub-combats"

import DrawerPage from "components/DrawerPage"
import Section from "components/Section"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useGetUseCases } from "providers/UseCasesProvider"
import colors from "styles/colors"
import layout from "styles/layout"

export default function WaitScreen({ charId }: { charId: string }) {
  const useCases = useGetUseCases()
  const { data: combatId } = useCombatId(charId)
  const { data: combatState } = useCombatState(combatId)

  const onPressEnd = () => {
    useCases.combat.endWait({ combatId, combatState, charId })
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
