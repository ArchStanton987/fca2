import { ReactNode } from "react"

import { Redirect } from "expo-router"

import {
  getDefaultPlayingId,
  getInitiativePrompts,
  getPlayerCanReact
} from "lib/combat/utils/combat-utils"

import List from "components/List"
import routes from "constants/routes"
import { useCharacter } from "contexts/CharacterContext"
import { useActionForm } from "providers/ActionProvider"
import { useCombatState } from "providers/CombatStateProvider"
import { useCombatStatus } from "providers/CombatStatusProvider"
import { useCombatStatuses } from "providers/CombatStatusesProvider"
import { SlidesProvider } from "providers/SlidesProvider"
import ActionUnavailableScreen from "screens/CombatScreen/ActionUnavailableScreen"
import InitiativeScreen from "screens/CombatScreen/InitiativeScreen"
import WaitInitiativeScreen from "screens/CombatScreen/WaitInitiativeScreen"
import getSlides from "screens/CombatScreen/slides/slides"

function SlideList() {
  const form = useActionForm()

  const slides = getSlides(form, false)

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
  const { action, actorIdOverride } = useCombatState()
  const contendersCombatStatus = useCombatStatuses()
  const combatStatus = useCombatStatus()

  const prompts = getInitiativePrompts(char.charId, contendersCombatStatus)
  if (prompts.playerShouldRollInitiative) return <InitiativeScreen />
  if (prompts.shouldWaitOthers) return <WaitInitiativeScreen />

  const defaultPlayingId = getDefaultPlayingId(contendersCombatStatus)
  const playingId = actorIdOverride || defaultPlayingId
  const isPlaying = playingId === char.charId

  const canReact = getPlayerCanReact(char, combatStatus, action)
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
