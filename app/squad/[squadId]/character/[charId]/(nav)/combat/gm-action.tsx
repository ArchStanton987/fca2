import { ReactNode } from "react"

import { getInitiativePrompts } from "lib/combat/utils/combat-utils"

import List from "components/List"
import { useCharacter } from "contexts/CharacterContext"
import { useActionForm } from "providers/ActionProvider"
import { useCombat } from "providers/CombatProvider"
import { useCombatStatus } from "providers/CombatStatusProvider"
import { SlidesProvider } from "providers/SlidesProvider"
import InitiativeScreen from "screens/CombatScreen/InitiativeScreen"
import WaitInitiativeScreen from "screens/CombatScreen/WaitInitiativeScreen"
import SlideError, { slideErrors } from "screens/CombatScreen/slides/SlideError"
import getSlides from "screens/CombatScreen/slides/slides"

function SlideList() {
  const form = useActionForm()

  const slides = getSlides(form, true)

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
  const char = useCharacter()
  const { combat } = useCombat()
  const combatStatuses = useCombatStatus()

  if (!combat?.id) return <SlideError error={slideErrors.noCombatError} />

  const prompts = getInitiativePrompts(char.charId, combatStatuses)
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
