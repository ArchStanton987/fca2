import { ReactNode, useMemo } from "react"

import { Redirect, useLocalSearchParams } from "expo-router"

import { useCurrCharId } from "lib/character/character-store"
import { useCombatId, useCombatStatuses } from "lib/character/combat-status/combat-status-provider"
import { useContenders } from "lib/combat/use-cases/sub-combats"
import { getInitiativePrompts, useGetPlayerCanReact } from "lib/combat/utils/combat-utils"

import { useActionSubtype, useActionType } from "providers/ActionFormProvider"
import { SlidesProvider } from "providers/SlidesProvider"
import InitiativeScreen from "screens/CombatScreen/InitiativeScreen"
import WaitInitiativeScreen from "screens/CombatScreen/WaitInitiativeScreen"
import ActionTypeSlide from "screens/CombatScreen/slides/ActionTypeSlide/ActionTypeSlide"
import AimSlide from "screens/CombatScreen/slides/AimSlide/AimSlide"
import ApAssignmentSlide from "screens/CombatScreen/slides/ApAssignmentSlide"
import ChallengeSlide from "screens/CombatScreen/slides/ChallengeSlide"
import DamageLocalizationSlide from "screens/CombatScreen/slides/DamageLocalizationSlide/DamageLocalizationSlide"
import DamageSlide from "screens/CombatScreen/slides/DamageSlide/DamageSlide"
import DiceRollSlide from "screens/CombatScreen/slides/DiceRollSlide/DiceRollSlide"
import PickActorSlide from "screens/CombatScreen/slides/PickActorSlide/PickActorSlide"
import PickTargetSlide from "screens/CombatScreen/slides/PickTargetSlide/PickTargetSlide"
import PickUpItemSlide from "screens/CombatScreen/slides/PickUpItemSlide"
import SlideError, { slideErrors } from "screens/CombatScreen/slides/SlideError"
import ValidateSlide from "screens/CombatScreen/slides/ValidateSlide/ValidateSlide"
import ScoreResultSlide from "screens/CombatScreen/slides/score-result/ScoreResultSlide"

export const attackSubtypes = ["hit", "throw", "basic", "aim", "burst"]

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
      <PickActorSlide slideIndex={0} />
      <ActionTypeSlide slideIndex={1} />
      <ApAssignmentSlide slideIndex={2} />
      {/* ITEM */}
      {isPickup ? <PickUpItemSlide slideIndex={3} /> : null}
      {isUse ? <ChallengeSlide /> : null}
      {/* MOVEMENT */}
      {isMovement ? <DiceRollSlide slideIndex={3} /> : null}
      {isMovement ? <ScoreResultSlide slideIndex={4} /> : null}
      {/* ATTACK */}
      {isAttack ? <PickTargetSlide slideIndex={3} /> : null}
      {isAim ? <AimSlide slideIndex={4} /> : null}
      {isAttack ? <DiceRollSlide slideIndex={isAim ? 5 : 4} /> : null}
      {isAttack ? <ScoreResultSlide slideIndex={isAim ? 6 : 5} /> : null}
      {isAttack && !isAim ? <DamageLocalizationSlide slideIndex={6} /> : null}
      {isAttack ? <DamageSlide slideIndex={7} /> : null}
      {isAttack ? <ValidateSlide /> : null}
    </>
  )
}

function WithActionRedirections({ children }: { children: ReactNode }) {
  const { squadId } = useLocalSearchParams<{ squadId: string }>()
  const charId = useCurrCharId()
  const { data: combatId } = useCombatId(charId)
  const { data: contendersIds } = useContenders(combatId)
  const combatStatuses = useCombatStatuses(contendersIds)

  const canReact = useGetPlayerCanReact(charId)

  if (!combatId) return <SlideError error={slideErrors.noCombatError} />

  const prompts = getInitiativePrompts(charId, combatStatuses)
  if (prompts.playerShouldRollInitiative) return <InitiativeScreen />
  if (prompts.shouldWaitOthers) return <WaitInitiativeScreen />

  if (canReact) {
    return (
      <Redirect
        href={{
          pathname: "/squad/[squadId]/character/[charId]/combat/reaction",
          params: { charId, squadId }
        }}
      />
    )
  }

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
