import { ReactNode } from "react"

import { Redirect } from "expo-router"

import {
  getInitiativePrompts,
  getPlayerCanReact,
  getPlayingOrder
} from "lib/combat/utils/combat-utils"

import List from "components/List"
import routes from "constants/routes"
import { useCharacter } from "contexts/CharacterContext"
import { useActionForm } from "providers/ActionProvider"
import { useCombat } from "providers/CombatProvider"
import { SlidesProvider } from "providers/SlidesProvider"
import ActionUnavailableScreen from "screens/CombatScreen/ActionUnavailableScreen"
import InitiativeScreen from "screens/CombatScreen/InitiativeScreen"
import WaitInitiativeScreen from "screens/CombatScreen/WaitInitiativeScreen"
import SlideError, { slideErrors } from "screens/CombatScreen/slides/SlideError"
import getSlides from "screens/CombatScreen/slides/slides"

function SlideList() {
  const { actionType, actionSubtype } = useActionForm()

  const slides = getSlides(actionType, actionSubtype)

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

  const contenders = getPlayingOrder({ ...players, ...npcs })
  const defaultPlayingId =
    contenders.find(c => c.char.status.combatStatus === "active")?.char.charId ??
    contenders.find(c => c.char.status.combatStatus === "wait")?.char.charId
  const playingId = combat.currActorId || defaultPlayingId
  const isPlaying = playingId === char.charId

  const canReact = getPlayerCanReact(char, combat)
  if (canReact) return <Redirect href={{ pathname: routes.combat.reaction }} />

  if (!isPlaying) return <ActionUnavailableScreen />

  return children
}

export default function ActionScreen() {
  return (
    <WithActionRedirections>
      <SlidesProvider sliderId="actionSlider">
        <SlideList />
      </SlidesProvider>
    </WithActionRedirections>
  )
}
