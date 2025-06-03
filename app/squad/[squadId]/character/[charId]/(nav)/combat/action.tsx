import { useRef } from "react"
import { ScrollView, useWindowDimensions } from "react-native"

import { useLocalSearchParams } from "expo-router"

import actions from "lib/combat/const/actions"
import { getInitiativePrompts, getPlayingOrder } from "lib/combat/utils/combat-utils"

import DrawerPage from "components/DrawerPage"
import List from "components/List"
import { SlideProps } from "components/Slides/Slide.types"
import { getSlideWidth } from "components/Slides/slide.utils"
import { useActionForm } from "providers/ActionProvider"
import { useCombat } from "providers/CombatProvider"
import ActionUnavailableScreen from "screens/CombatScreen/ActionUnavailableScreen"
import InitiativeScreen from "screens/CombatScreen/InitiativeScreen"
import WaitInitiativeScreen from "screens/CombatScreen/WaitInitiativeScreen"
import ActionTypeSlide from "screens/CombatScreen/slides/ActionTypeSlide/ActionTypeSlide"
import ApAssignment from "screens/CombatScreen/slides/ApAssignmentSlide"
import ChallengeSlide from "screens/CombatScreen/slides/ChallengeSlide"
import DiceResultSlide from "screens/CombatScreen/slides/DiceResultSlide"
import DiceRollSlide from "screens/CombatScreen/slides/DiceRollSlide/DiceRollSlide"
import PickUpItemSlide from "screens/CombatScreen/slides/PickUpItemSlide"
import SlideError, { slideErrors } from "screens/CombatScreen/slides/SlideError"

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

const movementSlides = [
  initSlide,
  apAssignmentSlide,
  diceRollSlide,
  {
    id: "diceResult",
    renderSlide: (props: SlideProps) => <DiceResultSlide skillId="physical" {...props} />
  }
]

const baseItemSlides = [initSlide, apAssignmentSlide]
const throwItemSlides = [
  ...baseItemSlides,
  diceRollSlide,
  {
    id: "diceResult",
    renderSlide: (props: SlideProps) => <DiceResultSlide skillId="throw" {...props} />
  }
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

// cas throw
// => pick target
// => roll dice
// => result

const getSlides = <T extends keyof typeof actions>(
  actionType: T | "",
  actionSubType?: keyof (typeof actions)[T]["subtypes"] | string
) => {
  if (actionType === "movement") {
    return movementSlides
  }
  if (actionType === "item") {
    if (actionSubType === "throw") return throwItemSlides
    if (actionSubType === "pickUp") return pickUpItemSlides
    if (actionSubType === "use") return useItemSlides

    return baseItemSlides
  }

  return [initSlide]
}

export default function ActionScreen() {
  const { charId } = useLocalSearchParams<{ charId: string }>()

  const { players, npcs, combat } = useCombat()

  const scrollRef = useRef<ScrollView>(null)
  const { width } = useWindowDimensions()
  const slideWidth = getSlideWidth(width)

  const scrollTo = (index: number) => {
    if (!scrollRef.current) return
    scrollRef.current.scrollTo({ x: index * slideWidth, animated: true })
  }

  const form = useActionForm()
  const slides = getSlides(form.actionType, form.actionSubtype)

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
