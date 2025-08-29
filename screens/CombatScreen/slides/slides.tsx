import actions from "lib/combat/const/actions"

import { SlideProps } from "components/Slides/Slide.types"

import ActionTypeSlide from "./ActionTypeSlide/ActionTypeSlide"
import AimSlide from "./AimSlide/AimSlide"
import ApAssignmentSlide from "./ApAssignmentSlide"
import ChallengeSlide from "./ChallengeSlide"
import DamageLocalizationSlide from "./DamageLocalizationSlide/DamageLocalizationSlide"
import DamageSlide from "./DamageSlide/DamageSlide"
import DiceRollSlide from "./DiceRollSlide/DiceRollSlide"
import PickTargetSlide from "./PickTargetSlide/PickTargetSlide"
import PickUpItemSlide from "./PickUpItemSlide"
import ValidateSlide from "./ValidateSlide/ValidateSlide"
import ScoreResultSlide from "./score-result/ScoreResultSlide"

const initSlide = {
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

const movementSlides = [initSlide, apAssignmentSlide, diceRollSlide, diceResultSlide]

const baseItemSlides = [initSlide, apAssignmentSlide]
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

const getSlides = <T extends keyof typeof actions>(
  actionType: T | "",
  actionSubType?: keyof (typeof actions)[T]["subtypes"] | string
) => {
  if (actionType === "other") return baseItemSlides
  if (actionType === "movement") return movementSlides
  if (actionType === "item") {
    if (actionSubType === "throw") return basicAttackSlides
    if (actionSubType === "pickUp") return pickUpItemSlides
    if (actionSubType === "use") return useItemSlides
    return baseItemSlides
  }
  if (actionType === "weapon") {
    if (actionSubType === "reload") return baseItemSlides
    if (actionSubType === "unload") return baseItemSlides
    if (actionSubType === "throw") return basicAttackSlides
    if (actionSubType === "hit") return basicAttackSlides
    if (actionSubType === "aim") return aimAttackSlides
    return basicAttackSlides
  }
  return [initSlide]
}

export default getSlides
