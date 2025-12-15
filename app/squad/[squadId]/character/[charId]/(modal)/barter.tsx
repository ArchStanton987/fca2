import { router, useLocalSearchParams } from "expo-router"

import { useCurrCharId } from "lib/character/character-store"
import { useBarterActions } from "lib/objects/barter-store"
import BarterSection from "lib/objects/ui/barter/BarterSection"

import ModalCta from "components/ModalCta/ModalCta"
import ModalBody from "components/wrappers/ModalBody"

export default function BarterModal() {
  const { squadId } = useLocalSearchParams<{ squadId: string }>()
  const charId = useCurrCharId()

  const actions = useBarterActions()

  const next = () => {
    router.push({
      pathname: "/squad/[squadId]/character/[charId]/barter-confirmation",
      params: { charId, squadId }
    })
  }

  const cancel = () => {
    actions.reset()
    router.back()
  }

  return (
    <ModalBody>
      <BarterSection />
      <ModalCta onPressConfirm={next} onPressCancel={cancel} />
    </ModalBody>
  )
}
