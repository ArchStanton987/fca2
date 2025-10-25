import { ReactNode } from "react"

import { Redirect, useLocalSearchParams } from "expo-router"

import {
  useCombatId,
  useCombatStatus,
  useCombatStatuses
} from "lib/character/combat-status/combat-status-provider"
import { useCharInfo } from "lib/character/info/info-provider"
import { useCombat, useCombatState } from "lib/combat/use-cases/sub-combat"
import {
  getDefaultPlayingId,
  getInitiativePrompts,
  getPlayerCanReact
} from "lib/combat/utils/combat-utils"

import List from "components/List"
import routes from "constants/routes"
import { useActionActorId, useActionSubtype, useActionType } from "providers/ActionFormProvider"
import { SlidesProvider } from "providers/SlidesProvider"
import ActionUnavailableScreen from "screens/CombatScreen/ActionUnavailableScreen"
import InitiativeScreen from "screens/CombatScreen/InitiativeScreen"
import WaitInitiativeScreen from "screens/CombatScreen/WaitInitiativeScreen"
import getSlides from "screens/CombatScreen/slides/slides"

function SlideList() {
  const actionType = useActionType()
  const actionSubtype = useActionSubtype()
  const actorId = useActionActorId()
  const payload = { actionType, actionSubtype, actorId }

  const slides = getSlides(payload, false)

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
  const { charId } = useLocalSearchParams<{ charId: string }>()
  const charInfo = useCharInfo(charId)
  const { data: combatId } = useCombatId(charId)
  const { data: combatState } = useCombatState(combatId)
  const { data: combat } = useCombat(combatId)
  const contendersCombatStatus = useCombatStatuses(combat?.contendersIds ?? [])
  const { data: combatStatus } = useCombatStatus(charId)

  const prompts = getInitiativePrompts(charId, contendersCombatStatus)
  if (prompts.playerShouldRollInitiative) return <InitiativeScreen />
  if (prompts.shouldWaitOthers) return <WaitInitiativeScreen />

  const defaultPlayingId = getDefaultPlayingId(contendersCombatStatus)
  const isDefaultPlayer = typeof defaultPlayingId === "string" && defaultPlayingId === charId
  const isOverrideId = combatState.actorIdOverride === charId
  const isPlaying = isOverrideId || isDefaultPlayer

  const canReact = getPlayerCanReact(charInfo.data, combatStatus, combatState.action)
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
