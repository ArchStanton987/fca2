import { useRef } from "react"
import { ScrollView, useWindowDimensions } from "react-native"

import { useLocalSearchParams } from "expo-router"

import { SkillId } from "lib/character/abilities/skills/skills.types"
import actions from "lib/combat/const/actions"
import { getInitiativePrompts, getPlayingOrder } from "lib/combat/utils/combat-utils"
import { Weapon } from "lib/objects/data/weapons/weapons.types"

import DrawerPage from "components/DrawerPage"
import List from "components/List"
import { SlideProps } from "components/Slides/Slide.types"
import { getSlideWidth } from "components/Slides/slide.utils"
import { useCharacter } from "contexts/CharacterContext"
import { useInventory } from "contexts/InventoryContext"
import { useActionForm } from "providers/ActionProvider"
import { useCombat } from "providers/CombatProvider"
import ActionUnavailableScreen from "screens/CombatScreen/ActionUnavailableScreen"
import InitiativeScreen from "screens/CombatScreen/InitiativeScreen"
import WaitInitiativeScreen from "screens/CombatScreen/WaitInitiativeScreen"
import ActionTypeSlide from "screens/CombatScreen/slides/ActionTypeSlide/ActionTypeSlide"
import AimSlide from "screens/CombatScreen/slides/AimSlide/AimSlide"
import ApAssignment from "screens/CombatScreen/slides/ApAssignmentSlide"
import ChallengeSlide from "screens/CombatScreen/slides/ChallengeSlide"
import DamageLocalizationSlide from "screens/CombatScreen/slides/DamageLocalizationSlide/DamageLocalizationSlide"
import DamageSlide from "screens/CombatScreen/slides/DamageSlide/DamageSlide"
import DiceResultSlide from "screens/CombatScreen/slides/DiceResultSlide"
import DiceRollSlide from "screens/CombatScreen/slides/DiceRollSlide/DiceRollSlide"
import PickTargetSlide from "screens/CombatScreen/slides/PickTargetSlide/PickTargetSlide"
import PickUpItemSlide from "screens/CombatScreen/slides/PickUpItemSlide"
import SlideError, { slideErrors } from "screens/CombatScreen/slides/SlideError"
import ValidateSlide from "screens/CombatScreen/slides/ValidateSlide/ValidateSlide"

const initSlide = {
  id: "actionType",
  renderSlide: (props: SlideProps) => <ActionTypeSlide {...props} />
}
const apAssignmentSlide = {
  id: "apAssignment",
  renderSlide: (props: SlideProps) => <ApAssignment {...props} />
}

const diceRollSlide = {
  id: "diceRoll",
  renderSlide: (props: SlideProps) => <DiceRollSlide {...props} />
}
const damageLocalizationSlide = {
  id: "damageLoc",
  renderSlide: (props: SlideProps) => <DamageLocalizationSlide {...props} />
}

const getDiceResultSlide = (skillId: SkillId) => ({
  id: "diceResult",
  renderSlide: (props: SlideProps) => <DiceResultSlide skillId={skillId} {...props} />
})

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

const movementSlides = [initSlide, apAssignmentSlide, diceRollSlide, getDiceResultSlide("physical")]

const baseItemSlides = [initSlide, apAssignmentSlide]
const getBasicAttackSlides = (skillId: SkillId) => [
  ...baseItemSlides,
  pickTargetSlide,
  diceRollSlide,
  getDiceResultSlide(skillId),
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

const getAimAttackSlides = (weapon: Weapon) => [
  ...baseItemSlides,
  pickTargetSlide,
  aimSlide,
  diceRollSlide,
  getDiceResultSlide(weapon.data.skillId),
  damageSlide,
  validateSlide
]

const getSlides = <T extends keyof typeof actions>(
  actionType: T | "",
  actionSubType?: keyof (typeof actions)[T]["subtypes"] | string,
  weapon?: Weapon
) => {
  if (actionType === "movement") {
    return movementSlides
  }
  if (actionType === "item") {
    if (actionSubType === "throw") return getBasicAttackSlides("throw")
    if (actionSubType === "pickUp") return pickUpItemSlides
    if (actionSubType === "use") return useItemSlides
    return baseItemSlides
  }
  if (actionType === "weapon") {
    if (!weapon) throw new Error("Couldn't get weapon slides")
    if (actionSubType === "reload") return baseItemSlides
    if (actionSubType === "unload") return baseItemSlides
    if (actionSubType === "throw") return getBasicAttackSlides("throw")
    if (actionSubType === "hit") return getBasicAttackSlides("melee")
    if (actionSubType === "aim") return getAimAttackSlides(weapon)
    return getBasicAttackSlides(weapon.data.skillId)
  }
  return [initSlide]
}

export default function ActionScreen() {
  const { charId } = useLocalSearchParams<{ charId: string }>()

  const char = useCharacter()
  const inv = useInventory()
  const { players, npcs, combat } = useCombat()

  const scrollRef = useRef<ScrollView>(null)
  const { width } = useWindowDimensions()
  const slideWidth = getSlideWidth(width)

  const scrollTo = (index: number) => {
    if (!scrollRef.current) return
    scrollRef.current.scrollTo({ x: index * slideWidth, animated: true })
  }

  const form = useActionForm()
  const { actionType, actionSubtype, itemDbKey } = form
  let weapon = char.unarmed
  if (itemDbKey) {
    weapon = inv.weaponsRecord[itemDbKey] ?? char.unarmed
  }
  const slides = getSlides(actionType, actionSubtype, weapon)

  if (!combat) return <SlideError error={slideErrors.noCombatError} />

  const prompts = getInitiativePrompts(charId, players ?? {}, npcs ?? {})
  if (prompts.playerShouldRollInitiative) return <InitiativeScreen />
  if (prompts.shouldWaitOthers) return <WaitInitiativeScreen />

  const contenders = getPlayingOrder({ ...players, ...npcs })
  const defaultPlayingId =
    contenders.find(c => c.char.status.combatStatus === "active")?.char.charId ??
    contenders.find(c => c.char.status.combatStatus === "wait")?.char.charId
  const playingId = combat.currActorId || defaultPlayingId
  const isPlaying = playingId === charId

  if (!isPlaying) return <ActionUnavailableScreen />

  return (
    <DrawerPage>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={slideWidth}
        decelerationRate="fast"
        disableIntervalMomentum
        ref={scrollRef}
        bounces={false}
      >
        <List
          data={slides}
          horizontal
          keyExtractor={item => item.id}
          renderItem={({ item, index }) =>
            item.renderSlide({
              scrollNext: () => scrollTo(index + 1),
              scrollPrevious: () => scrollTo(index - 1)
            })
          }
        />
      </ScrollView>
    </DrawerPage>
  )
}
