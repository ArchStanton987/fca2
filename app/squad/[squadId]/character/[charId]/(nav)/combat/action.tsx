import { ReactNode, useMemo } from "react"

import { Redirect, useLocalSearchParams } from "expo-router"

import { useCurrCharId } from "lib/character/character-store"
import { useCombatId, useCombatStatuses } from "lib/character/combat-status/combat-status-provider"
import { useCombat, useCombatState } from "lib/combat/use-cases/sub-combats"
import {
  getDefaultPlayingId,
  getInitiativePrompts,
  useGetPlayerCanReact
} from "lib/combat/utils/combat-utils"

import { useActionSubtype, useActionType } from "providers/ActionFormProvider"
import { SlidesProvider } from "providers/SlidesProvider"
import ActionUnavailableScreen from "screens/CombatScreen/ActionUnavailableScreen"
import InitiativeScreen from "screens/CombatScreen/InitiativeScreen"
import WaitInitiativeScreen from "screens/CombatScreen/WaitInitiativeScreen"
import ActionTypeSlide from "screens/CombatScreen/slides/ActionTypeSlide/ActionTypeSlide"
import AimSlide from "screens/CombatScreen/slides/AimSlide/AimSlide"
import ApAssignmentSlide from "screens/CombatScreen/slides/ApAssignmentSlide"
import ChallengeSlide from "screens/CombatScreen/slides/ChallengeSlide"
import DamageLocalizationSlide from "screens/CombatScreen/slides/DamageLocalizationSlide/DamageLocalizationSlide"
import DamageSlide from "screens/CombatScreen/slides/DamageSlide/DamageSlide"
import DiceRollSlide from "screens/CombatScreen/slides/DiceRollSlide/DiceRollSlide"
import PickTargetSlide from "screens/CombatScreen/slides/PickTargetSlide/PickTargetSlide"
import PickUpItemSlide from "screens/CombatScreen/slides/PickUpItemSlide"
import ValidateSlide from "screens/CombatScreen/slides/ValidateSlide/ValidateSlide"
import ScoreResultSlide from "screens/CombatScreen/slides/score-result/ScoreResultSlide"

import { attackSubtypes } from "./gm-action"

function SlideList() {
  const actionType = useActionType()
  const actionSubtype = useActionSubtype()

  const isAim = useMemo(() => actionSubtype === "aim", [actionSubtype])
  const isAttack = useMemo(() => attackSubtypes.includes(actionSubtype), [actionSubtype])
  const isPickup = useMemo(() => actionSubtype === "pickUp", [actionSubtype])
  const isUse = useMemo(() => actionSubtype === "use", [actionSubtype])
  const isMovement = useMemo(() => actionType === "movement", [actionType])

  return (
    <>
      <ActionTypeSlide slideIndex={0} />
      <ApAssignmentSlide slideIndex={1} />
      {/* ITEM */}
      {isPickup ? <PickUpItemSlide slideIndex={2} /> : null}
      {isUse ? <ChallengeSlide /> : null}
      {/* MOVEMENT */}
      {isMovement ? <DiceRollSlide slideIndex={2} /> : null}
      {isMovement ? <ScoreResultSlide slideIndex={3} /> : null}
      {/* ATTACK */}
      {isAttack ? <PickTargetSlide slideIndex={2} /> : null}
      {isAim ? <AimSlide slideIndex={3} /> : null}
      {isAttack ? <DiceRollSlide slideIndex={isAim ? 4 : 3} /> : null}
      {isAttack ? <ScoreResultSlide slideIndex={isAim ? 5 : 4} /> : null}
      {isAttack && !isAim ? <DamageLocalizationSlide slideIndex={5} /> : null}
      {isAttack ? <DamageSlide slideIndex={6} /> : null}
      {isAttack ? <ValidateSlide /> : null}
    </>
  )
}

function NoCombatRedirection({ children }: { children: ReactNode }) {
  const { squadId } = useLocalSearchParams<{ squadId: string }>()
  const charId = useCurrCharId()
  const { data: combatId } = useCombatId(charId)
  if (combatId === "")
    return (
      <Redirect
        href={{
          pathname: "/squad/[squadId]/character/[charId]/combat/recap",
          params: { squadId, charId }
        }}
      />
    )
  return children
}

function WithActionRedirections({ children }: { children: ReactNode }) {
  const { squadId } = useLocalSearchParams<{ squadId: string }>()
  const charId = useCurrCharId()
  const { data: combatId } = useCombatId(charId)
  const { data: combatState } = useCombatState(combatId)
  const { data: combat } = useCombat(combatId)
  const contendersCombatStatus = useCombatStatuses(combat?.contendersIds ?? [])

  const canReact = useGetPlayerCanReact(charId)

  const prompts = getInitiativePrompts(charId, contendersCombatStatus)
  if (prompts.playerShouldRollInitiative) return <InitiativeScreen />
  if (prompts.shouldWaitOthers) return <WaitInitiativeScreen />

  const defaultPlayingId = getDefaultPlayingId(contendersCombatStatus)
  const isDefaultPlayer = typeof defaultPlayingId === "string" && defaultPlayingId === charId
  const isOverriden = combatState.actorIdOverride !== ""
  const isOverrideId = combatState.actorIdOverride === charId
  const isPlaying = isOverriden ? isOverrideId : isDefaultPlayer

  if (canReact)
    return (
      <Redirect
        href={{
          pathname: "/squad/[squadId]/character/[charId]/combat/reaction",
          params: { squadId, charId }
        }}
      />
    )

  if (!isPlaying) return <ActionUnavailableScreen charId={charId} />

  return children
}

export default function ActionScreen() {
  return (
    <NoCombatRedirection>
      <WithActionRedirections>
        <SlidesProvider sliderId="actionSlider">
          <SlideList />
        </SlidesProvider>
      </WithActionRedirections>
    </NoCombatRedirection>
  )
}
