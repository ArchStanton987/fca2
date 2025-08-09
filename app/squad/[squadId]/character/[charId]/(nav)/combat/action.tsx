import { ScrollView } from "react-native"

import { Redirect } from "expo-router"

import {
  getActionId,
  getCurrentRoundId,
  getInitiativePrompts,
  getPlayerCanReact,
  getPlayingOrder
} from "lib/combat/utils/combat-utils"

import DrawerPage from "components/DrawerPage"
import List from "components/List"
import routes from "constants/routes"
import { useCharacter } from "contexts/CharacterContext"
import { useInventory } from "contexts/InventoryContext"
import useScrollToSlide from "hooks/useScrollToSlide"
import { useActionForm } from "providers/ActionProvider"
import { useCombat } from "providers/CombatProvider"
import ActionUnavailableScreen from "screens/CombatScreen/ActionUnavailableScreen"
import InitiativeScreen from "screens/CombatScreen/InitiativeScreen"
import WaitInitiativeScreen from "screens/CombatScreen/WaitInitiativeScreen"
import SlideError, { slideErrors } from "screens/CombatScreen/slides/SlideError"
import getSlides from "screens/CombatScreen/slides/slides"

export default function ActionScreen() {
  const char = useCharacter()
  const inv = useInventory()
  const { players, npcs, combat } = useCombat()

  const roundId = getCurrentRoundId(combat)
  const actionId = getActionId(combat)

  const { scrollRef, scrollTo, slideWidth } = useScrollToSlide()

  const form = useActionForm()
  const { actionType, actionSubtype, itemDbKey } = form
  let weapon = char.unarmed
  if (itemDbKey) {
    weapon = inv.weaponsRecord[itemDbKey] ?? char.unarmed
  }
  const slides = getSlides(actionType, actionSubtype, weapon)

  if (!combat?.id) return <SlideError error={slideErrors.noCombatError} />

  const prompts = getInitiativePrompts(char.charId, players ?? {}, npcs ?? {})
  if (prompts.playerShouldRollInitiative) return <InitiativeScreen />
  if (prompts.shouldWaitOthers) return <WaitInitiativeScreen />

  const contenders = getPlayingOrder({ ...players, ...npcs })
  const defaultPlayingId =
    contenders.find(c => c.char.status.combatStatus === "active")?.char.charId ??
    contenders.find(c => c.char.status.combatStatus === "wait")?.char.charId
  const playingId = combat.currActorId || defaultPlayingId
  const isPlaying = playingId === char.charId

  const canReact = getPlayerCanReact(char, combat)
  if (canReact) return <Redirect href={{ pathname: routes.combat.reaction }} />

  if (!isPlaying) return <ActionUnavailableScreen />

  return (
    <DrawerPage key={`${roundId}-${actionId}`}>
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
