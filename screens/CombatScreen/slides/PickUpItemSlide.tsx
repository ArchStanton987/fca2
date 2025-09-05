import Toast from "react-native-toast-message"

import DrawerSlide from "components/Slides/DrawerSlide"
import { SlideProps } from "components/Slides/Slide.types"
import UpdateObjects from "components/UpdateObjects/UpdateObjects"
import { useCharacter } from "contexts/CharacterContext"
import { useUpdateObjects } from "contexts/UpdateObjectsContext"
import { useActionApi, useActionForm } from "providers/ActionProvider"
import { useCombat } from "providers/CombatProvider"
import { useInventories } from "providers/InventoriesProvider"
import { useScrollTo } from "providers/SlidesProvider"
import { useGetUseCases } from "providers/UseCasesProvider"

export default function PickUpItemSlide({ slideIndex }: SlideProps) {
  const useCases = useGetUseCases()
  const character = useCharacter()

  const { state } = useUpdateObjects()
  const { reset } = useActionApi()
  const form = useActionForm()

  const { combat, npcs, players } = useCombat()
  const contenders = { ...players, ...npcs }
  const actorId = form.actorId === "" ? character.charId : form.actorId
  const actor = contenders[actorId]?.char
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
      const payload = combat.currAction
      await useCases.combat.doCombatAction({ combat, contenders, action: payload })
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
