import { SlideProps } from "components/Slides/Slide.types"
import { ActionFormType } from "providers/ActionProvider"

import ActionTypeSlide from "./ActionTypeSlide/ActionTypeSlide"
import AimSlide from "./AimSlide/AimSlide"
import ApAssignmentSlide from "./ApAssignmentSlide"
import ChallengeSlide from "./ChallengeSlide"
import DamageLocalizationSlide from "./DamageLocalizationSlide/DamageLocalizationSlide"
import DamageSlide from "./DamageSlide/DamageSlide"
import DiceRollSlide from "./DiceRollSlide/DiceRollSlide"
import PickActorSlide from "./PickActorSlide"
import PickTargetSlide from "./PickTargetSlide/PickTargetSlide"
import PickUpItemSlide from "./PickUpItemSlide"
import ValidateSlide from "./ValidateSlide/ValidateSlide"
import ScoreResultSlide from "./score-result/ScoreResultSlide"

const pickActorSlide = {
  id: "pickActor",
  renderSlide: (props: SlideProps) => <PickActorSlide {...props} />
}

const pickActionSlide = {
  id: "actionType",
  renderSlide: (props: SlideProps) => <ActionTypeSlide {...props} />
}
const apAssignmentSlide = {
  id: "apAssignment",
  renderSlide: (props: SlideProps) => <ApAssignmentSlide {...props} />
}

const diceRollSlide = {
  id: "diceRoll",
  renderSlide: (props: SlideProps) => <DiceRollSlide {...props} />
}
const damageLocalizationSlide = {
  id: "damageLoc",
  renderSlide: (props: SlideProps) => <DamageLocalizationSlide {...props} />
}

const diceResultSlide = {
  id: "diceResult",
  renderSlide: (props: SlideProps) => <ScoreResultSlide {...props} />
}

const pickTargetSlide = {
  id: "pickTarget",
  renderSlide: (props: SlideProps) => <PickTargetSlide {...props} />
}

const damageSlide = {
  id: "damageSlide",
  renderSlide: (props: SlideProps) => <DamageSlide {...props} />
}
const validateSlide = {
  id: "validateSlide",
  renderSlide: () => <ValidateSlide />
}

const movementSlides = [pickActionSlide, apAssignmentSlide, diceRollSlide, diceResultSlide]

const baseItemSlides = [pickActionSlide, apAssignmentSlide]
const basicAttackSlides = [
  ...baseItemSlides,
  pickTargetSlide,
  diceRollSlide,
  diceResultSlide,
  damageLocalizationSlide,
  damageSlide,
  validateSlide
]
const pickUpItemSlides = [
  ...baseItemSlides,
  {
    id: "pickUpItem",
    renderSlide: (props: SlideProps) => <PickUpItemSlide {...props} />
  }
]
const useItemSlides = [
  ...baseItemSlides,
  {
    id: "useItem",
    renderSlide: () => <ChallengeSlide />
  }
]
const aimSlide = {
  id: "aimSlide",
  renderSlide: (props: SlideProps) => <AimSlide {...props} />
}

const aimAttackSlides = [
  ...baseItemSlides,
  pickTargetSlide,
  aimSlide,
  diceRollSlide,
  diceResultSlide,
  damageSlide,
  validateSlide
]

const getSlides = (form: ActionFormType, isGm = false) => {
  const { actionType, actionSubtype, actorId } = form
  let result
  if (actorId === "" && isGm) return [pickActorSlide]
  if (actionType === "other") result = baseItemSlides
  if (actionType === "movement") result = movementSlides
  if (actionType === "item") {
    if (actionSubtype === "throw") result = basicAttackSlides
    if (actionSubtype === "pickUp") result = pickUpItemSlides
    if (actionSubtype === "use") result = useItemSlides
    result = baseItemSlides
  } else if (actionType === "weapon") {
    if (actionSubtype === "reload") result = baseItemSlides
    if (actionSubtype === "unload") result = baseItemSlides
    if (actionSubtype === "throw") result = basicAttackSlides
    if (actionSubtype === "hit") result = basicAttackSlides
    if (actionSubtype === "aim") result = aimAttackSlides
    result = basicAttackSlides
  } else {
    result = [pickActionSlide]
  }
  return isGm ? [pickActorSlide, ...result] : result
}

export default getSlides
