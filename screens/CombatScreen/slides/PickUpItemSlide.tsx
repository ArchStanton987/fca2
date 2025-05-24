import Toast from "react-native-toast-message"

import DrawerSlide from "components/Slides/DrawerSlide"
import { SlideProps } from "components/Slides/Slide.types"
import UpdateObjects from "components/UpdateObjects/UpdateObjects"
import { useCharacter } from "contexts/CharacterContext"
import { useInventory } from "contexts/InventoryContext"
import { useUpdateObjects } from "contexts/UpdateObjectsContext"
import { useActionApi, useActionForm } from "providers/ActionProvider"
import { useCombat } from "providers/CombatProvider"
import { useGetUseCases } from "providers/UseCasesProvider"

export default function PickUpItemSlide({ scrollPrevious }: SlideProps) {
  const useCases = useGetUseCases()
  const character = useCharacter()
  const inventory = useInventory()

  const { state } = useUpdateObjects()
  const form = useActionForm()
  const { reset } = useActionApi()

  const { combat, npcs, players } = useCombat()
  const contenders = { ...players, ...npcs }

  const onPressCancel = () => {
    if (scrollPrevious) {
      scrollPrevious()
    }
  }

  const onPressNext = async () => {
    if (!combat) throw new Error("No combat found")
    try {
      await useCases.inventory.exchange(character, state, inventory)
      await useCases.combat.doCombatAction({ combat, contenders, action: form })
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
