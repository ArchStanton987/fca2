import { useCallback, useRef } from "react"
import { ScrollView, useWindowDimensions } from "react-native"

import { useFocusEffect, useLocalSearchParams } from "expo-router"

import actions from "lib/combat/const/actions"
import { getInitiativePrompts, getPlayingOrder } from "lib/combat/utils/combat-utils"

import DrawerPage from "components/DrawerPage"
import List from "components/List"
import { SlideProps } from "components/Slides/Slide.types"
import { getSlideWidth } from "components/Slides/slide.utils"
import { useActionApi, useActionForm } from "providers/ActionProvider"
import { useCombat } from "providers/CombatProvider"
import ActionUnavailableScreen from "screens/CombatScreen/ActionUnavailableScreen"
import InitiativeScreen from "screens/CombatScreen/InitiativeScreen"
import WaitInitiativeScreen from "screens/CombatScreen/WaitInitiativeScreen"
import ActionTypeSlide from "screens/CombatScreen/slides/ActionTypeSlide/ActionTypeSlide"
import ApAssignment from "screens/CombatScreen/slides/ApAssignmentSlide"
import DiceResultSlide from "screens/CombatScreen/slides/DiceResultSlide"
import DiceRollSlide from "screens/CombatScreen/slides/DiceRollSlide/DiceRollSlide"
import SlideError, { slideErrors } from "screens/CombatScreen/slides/SlideError"

const initSlide = {
  id: "actionType",
  renderSlide: (props: SlideProps) => <ActionTypeSlide {...props} />
}

const getSlides = <T extends keyof typeof actions>(form: {
  actionType: T | ""
  actionSubType?: keyof (typeof actions)[T]["subtypes"] | ""
}) => {
  const { actionType, actionSubType } = form
  if (actionType === "movement") {
    return [
      initSlide,
      {
        id: "apAssignment",
        renderSlide: (props: SlideProps) => <ApAssignment {...props} />
      },
      {
        id: "diceRoll",
        renderSlide: (props: SlideProps) => <DiceRollSlide {...props} />
      },
      {
        id: "diceResult",
        renderSlide: (props: SlideProps) => <DiceResultSlide skillId="physical" {...props} />
      }
    ]
  }
  if (actionType === "item") {
    if (actionSubType === "use") {
      return [
        initSlide,
        {
          id: "apAssignment",
          renderSlide: (props: SlideProps) => <ApAssignment {...props} />
        },
        {
          id: "use",
          renderSlide: (props: SlideProps) => <DiceRollSlide {...props} />
        }
      ]
    }
    return [
      initSlide,
      {
        id: "apAssignment",
        renderSlide: (props: SlideProps) => <ApAssignment {...props} />
      }
    ]
  }

  return [initSlide]
}

export default function ActionScreen() {
  const { charId } = useLocalSearchParams<{ charId: string }>()

  const { reset } = useActionApi()
  const { players, npcs, combat } = useCombat()

  const scrollRef = useRef<ScrollView>(null)
  const { width } = useWindowDimensions()
  const slideWidth = getSlideWidth(width)

  const scrollTo = (index: number) => {
    if (!scrollRef.current) return
    scrollRef.current.scrollTo({ x: index * slideWidth, animated: true })
  }

  const form = useActionForm()
  const slides = getSlides(form)

  useFocusEffect(
    useCallback(() => {
      reset()
    }, [reset])
  )

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
        scrollEnabled={false}
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
