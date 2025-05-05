import { useCallback, useRef } from "react"
import { ScrollView, useWindowDimensions } from "react-native"

import { useFocusEffect, useLocalSearchParams } from "expo-router"

import { getInitiativePrompts, getPlayingOrder } from "lib/combat/utils/combat-utils"

import DrawerPage from "components/DrawerPage"
import List from "components/List"
import { SlideProps } from "components/Slides/Slide.types"
import { getSlideWidth } from "components/Slides/slide.utils"
import Txt from "components/Txt"
import { useActionApi } from "providers/ActionProvider"
import { useCombat } from "providers/CombatProvider"
import ActionUnavailableScreen from "screens/CombatScreen/ActionUnavailableScreen"
import InitiativeScreen from "screens/CombatScreen/InitiativeScreen"
import WaitInitiativeScreen from "screens/CombatScreen/WaitInitiativeScreen"
import ActionTypeSlide from "screens/CombatScreen/slides/ActionTypeSlide/ActionTypeSlide"

const getSlides = () => [
  {
    id: "actionType",
    renderSlide: ({ scrollNext }: SlideProps) => <ActionTypeSlide scrollNext={scrollNext} />
  }
]

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

  const slides = getSlides()

  useFocusEffect(
    useCallback(() => {
      reset()
    }, [reset])
  )

  if (!combat) return <Txt>Aucun combat trouvé</Txt>

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
        // scrollEnabled={false}
      >
        <List
          data={slides}
          horizontal
          keyExtractor={item => item.id}
          renderItem={({ item, index }) =>
            item.renderSlide({ scrollNext: () => scrollTo(index + 1) })
          }
        />
      </ScrollView>
    </DrawerPage>
  )
}
