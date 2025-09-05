import { ReactNode } from "react"

import { Redirect } from "expo-router"

import { getInitiativePrompts, getPlayerCanReact } from "lib/combat/utils/combat-utils"

import List from "components/List"
import routes from "constants/routes"
import { useCharacter } from "contexts/CharacterContext"
import { useActionForm } from "providers/ActionProvider"
import { useCombat } from "providers/CombatProvider"
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
  const { players, npcs, combat } = useCombat()

  if (!combat?.id) return <SlideError error={slideErrors.noCombatError} />

  const prompts = getInitiativePrompts(char.charId, players ?? {}, npcs ?? {})
  if (prompts.playerShouldRollInitiative) return <InitiativeScreen />
  if (prompts.shouldWaitOthers) return <WaitInitiativeScreen />

  const canReact = getPlayerCanReact(char, combat)
  if (canReact) return <Redirect href={{ pathname: routes.combat.reaction }} />

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
