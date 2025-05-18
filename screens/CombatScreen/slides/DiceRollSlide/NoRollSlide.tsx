import { TouchableHighlight } from "react-native"

import Section from "components/Section"
import DrawerSlide from "components/Slides/DrawerSlide"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useActionForm } from "providers/ActionProvider"
import { useCombat } from "providers/CombatProvider"
import { useGetUseCases } from "providers/UseCasesProvider"
import colors from "styles/colors"

import SlideError, { slideErrors } from "../SlideError"

export default function NoRollSlide() {
  const useCases = useGetUseCases()
  const form = useActionForm()
  const { combat, players, npcs } = useCombat()
  const contenders = { ...players, ...npcs }

  const submit = async () => {
    if (!combat) throw new Error("No combat found")
    await useCases.combat.doCombatAction({ combat, contenders, action: form })
  }

  if (!combat) return <SlideError error={slideErrors.noCombatError} />

  return (
    <DrawerSlide>
      <Section
        style={{ flex: 1 }}
        contentContainerStyle={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        <Txt>
          D&apos;après le MJ, vous n&apos;avez pas besoin de lancer les dés pour cette fois.
        </Txt>
        <Spacer y={30} />
        <Txt>Vous réussissez votre action !</Txt>
        <Spacer y={30} />
        <TouchableHighlight
          style={{
            borderWidth: 2,
            backgroundColor: colors.secColor,
            paddingVertical: 15,
            paddingHorizontal: 20
          }}
          onPress={submit}
        >
          <Txt style={{ color: colors.primColor }}>VALIDER</Txt>
        </TouchableHighlight>
      </Section>
    </DrawerSlide>
  )
}
