import { TouchableHighlight } from "react-native"

import { useCombatId } from "lib/character/combat-status/combat-status-provider"
import { useCombatState } from "lib/combat/use-cases/sub-combat"
import { useItem } from "lib/inventory/use-sub-inv-cat"
import Toast from "react-native-toast-message"

import Section from "components/Section"
import DrawerSlide from "components/Slides/DrawerSlide"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useActionActorId, useActionApi, useActionItemDbKey } from "providers/ActionFormProvider"
import { useGetUseCases } from "providers/UseCasesProvider"
import colors from "styles/colors"

export default function NoRollSlide() {
  const useCases = useGetUseCases()
  const itemDbKey = useActionItemDbKey()
  const actorId = useActionActorId()
  const { reset } = useActionApi()

  const { data: combatId } = useCombatId(actorId)
  const { data: action } = useCombatState(combatId, s => s.action)
  const { data: item } = useItem(actorId, itemDbKey ?? "")

  const submit = async () => {
    try {
      await useCases.combat.doCombatAction({ combatId, action, item })
      Toast.show({ type: "custom", text1: "Action enregistrée !" })
      reset()
    } catch (err) {
      Toast.show({ type: "error", text1: "Erreur lors de l'enregistrement de l'action. " })
    }
  }

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
