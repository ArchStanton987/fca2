import { useLocalSearchParams } from "expo-router"

import { useCombatId } from "lib/character/combat-status/combat-status-provider"
import { useCombatState } from "lib/combat/use-cases/sub-combat"
import { useBarterStock } from "lib/objects/barter-store"
import BarterSection from "lib/objects/ui/barter/BarterSection"
import Toast from "react-native-toast-message"

import DrawerSlide from "components/Slides/DrawerSlide"
import { SlideProps } from "components/Slides/Slide.types"
import { useActionActorId, useActionApi } from "providers/ActionFormProvider"
import { useScrollTo } from "providers/SlidesProvider"
import { useGetUseCases } from "providers/UseCasesProvider"

export default function PickUpItemSlide({ slideIndex }: SlideProps) {
  const { charId } = useLocalSearchParams<{ charId: string }>()

  const useCases = useGetUseCases()

  const { reset } = useActionApi()
  const formActorId = useActionActorId()

  const { data: combatId } = useCombatId(charId)
  const { data: action } = useCombatState(combatId, state => state.action)
  const actorId = formActorId === "" ? charId : formActorId

  const exchange = useBarterStock()

  const { scrollTo } = useScrollTo()

  const scrollPrevious = () => {
    scrollTo(slideIndex - 1)
  }

  const onPressCancel = () => {
    if (scrollPrevious) {
      scrollPrevious()
    }
  }

  const onPressNext = async () => {
    try {
      await useCases.inventory.barter({ charId: actorId, ...exchange })
      await useCases.combat.doCombatAction({ combatId, action })
      Toast.show({ type: "custom", text1: "Action réalisée" })
      reset()
    } catch (error) {
      Toast.show({ type: "error", text1: "Erreur lors de l'enregistrement de l'action" })
    }
  }

  return (
    <DrawerSlide>
      <BarterSection onPressCancel={onPressCancel} onPressNext={onPressNext} />
    </DrawerSlide>
  )
}
