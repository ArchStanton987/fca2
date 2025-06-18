import { useRef } from "react"
import { ScrollView, useWindowDimensions } from "react-native"

import { useLocalSearchParams } from "expo-router"

import { getInitiativePrompts, getPlayingOrder } from "lib/combat/utils/combat-utils"

import DrawerPage from "components/DrawerPage"
import List from "components/List"
import { getSlideWidth } from "components/Slides/slide.utils"
import { useCharacter } from "contexts/CharacterContext"
import { useInventory } from "contexts/InventoryContext"
import { useActionForm } from "providers/ActionProvider"
import { useCombat } from "providers/CombatProvider"
import ActionUnavailableScreen from "screens/CombatScreen/ActionUnavailableScreen"
import InitiativeScreen from "screens/CombatScreen/InitiativeScreen"
import WaitInitiativeScreen from "screens/CombatScreen/WaitInitiativeScreen"
import SlideError, { slideErrors } from "screens/CombatScreen/slides/SlideError"
import getSlides from "screens/CombatScreen/slides/slides"

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
