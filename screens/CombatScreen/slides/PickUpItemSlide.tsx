import Toast from "react-native-toast-message"

import DrawerSlide from "components/Slides/DrawerSlide"
import { SlideProps } from "components/Slides/Slide.types"
import UpdateObjects from "components/UpdateObjects/UpdateObjects"
import { useCharacter } from "contexts/CharacterContext"
import { useUpdateObjects } from "contexts/UpdateObjectsContext"
import { useActionActorId, useActionApi } from "providers/ActionFormProvider"
import { useCombat } from "providers/CombatProvider"
import { useCombatState } from "providers/CombatStateProvider"
import { useCombatStatuses } from "providers/CombatStatusesProvider"
import { useContenders } from "providers/ContendersProvider"
import { useInventories } from "providers/InventoriesProvider"
import { useScrollTo } from "providers/SlidesProvider"
import { useGetUseCases } from "providers/UseCasesProvider"

export default function PickUpItemSlide({ slideIndex }: SlideProps) {
  const useCases = useGetUseCases()
  const combatStatuses = useCombatStatuses()
  const contenders = useContenders()
  const { charId } = useCharacter()

  const { state } = useUpdateObjects()
  const { reset } = useActionApi()
  const formActorId = useActionActorId()

  const combat = useCombat()
  const { action } = useCombatState()
  const actorId = formActorId === "" ? charId : formActorId
  const actor = contenders[actorId]
  const inventory = useInventories(actorId)

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
    if (!combat) throw new Error("No combat found")
    try {
      await useCases.inventory.exchange(actor, state, inventory)
      await useCases.combat.doCombatAction({ combat, contenders, combatStatuses, action })
      Toast.show({ type: "custom", text1: "Action réalisée" })
      reset()
    } catch (error) {
      Toast.show({ type: "error", text1: "Erreur lors de l'enregistrement de l'action" })
    }
  }

  return (
    <DrawerSlide>
      <UpdateObjects onPressCancel={onPressCancel} onPressNext={onPressNext} />
    </DrawerSlide>
  )
}
