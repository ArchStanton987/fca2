import { ReactNode } from "react"

import { useCharInfo } from "lib/character/character-provider"
import { getInitiativePrompts } from "lib/combat/utils/combat-utils"

import List from "components/List"
import { useActionActorId, useActionSubtype, useActionType } from "providers/ActionFormProvider"
import { useCombat } from "providers/CombatProvider"
import { useCombatStatuses } from "providers/CombatStatusesProvider"
import { SlidesProvider } from "providers/SlidesProvider"
import InitiativeScreen from "screens/CombatScreen/InitiativeScreen"
import WaitInitiativeScreen from "screens/CombatScreen/WaitInitiativeScreen"
import SlideError, { slideErrors } from "screens/CombatScreen/slides/SlideError"
import getSlides from "screens/CombatScreen/slides/slides"

function SlideList() {
  const actionType = useActionType()
  const actionSubtype = useActionSubtype()
  const actorId = useActionActorId()
  const payload = { actionType, actionSubtype, actorId }

  const slides = getSlides(payload, true)

  return (
    <List
      data={slides}
      horizontal
      keyExtractor={item => item.id}
      renderItem={({ item, index }) => item.renderSlide({ slideIndex: index })}
    />
  )
}

function WithActionRedirections({ children }: { children: ReactNode }) {
  const { charId } = useCharInfo()
  const combat = useCombat()
  const combatStatuses = useCombatStatuses()

  if (!combat?.id) return <SlideError error={slideErrors.noCombatError} />

  const prompts = getInitiativePrompts(charId, combatStatuses)
  if (prompts.playerShouldRollInitiative) return <InitiativeScreen />
  if (prompts.shouldWaitOthers) return <WaitInitiativeScreen />

  return children
}

export default function GMActionScreen() {
  return (
    <WithActionRedirections>
      <SlidesProvider sliderId="gmActionSlider">
        <SlideList />
      </SlidesProvider>
    </WithActionRedirections>
  )
}
