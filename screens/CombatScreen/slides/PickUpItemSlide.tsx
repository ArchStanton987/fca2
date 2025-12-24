import { memo } from "react"
import { StyleSheet } from "react-native"

import { useCurrCharId } from "lib/character/character-store"
import { useCombatId } from "lib/character/combat-status/combat-status-provider"
import { useCombatState } from "lib/combat/use-cases/sub-combats"
import {
  useBarterAmmos,
  useBarterCaps,
  useBarterClothings,
  useBarterConsumables,
  useBarterMiscObjects,
  useBarterWeapons,
  useHasSearch
} from "lib/objects/barter-store"
import Barter from "lib/objects/ui/barter/BarterComponents"
import Toast from "react-native-toast-message"

import Col from "components/Col"
import Section from "components/Section"
import ScrollSection from "components/Section/ScrollSection"
import DrawerSlide from "components/Slides/DrawerSlide"
import { SlideProps } from "components/Slides/Slide.types"
import Spacer from "components/Spacer"
import { useActionActorId, useActionApi } from "providers/ActionFormProvider"
import { useScrollTo } from "providers/SlidesProvider"
import { useGetUseCases } from "providers/UseCasesProvider"
import layout from "styles/layout"

import GoBackButton from "./GoBackButton"
import PlayButton from "./PlayButton"

const styles = StyleSheet.create({
  modCol: {
    width: 170
  },
  ctaSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly"
  },
  extend: {
    flex: 1
  }
})

function Search() {
  const hasSearch = useHasSearch()
  return hasSearch ? (
    <>
      <Barter.SearchInput />
      <Spacer y={layout.globalPadding} />
    </>
  ) : null
}

function CtaSection({ slideIndex }: { slideIndex: number }) {
  const charId = useCurrCharId()

  const useCases = useGetUseCases()

  const { reset } = useActionApi()
  const formActorId = useActionActorId()

  const { data: combatId } = useCombatId(charId)
  const { data: action } = useCombatState(combatId, state => state.action)
  const actorId = formActorId === "" ? charId : formActorId

  const barterCaps = useBarterCaps()
  const barterAmmo = useBarterAmmos()
  const barterWeapons = useBarterWeapons()
  const barterClothings = useBarterClothings()
  const barterConsumables = useBarterConsumables()
  const barterMiscObjects = useBarterMiscObjects()

  const { scrollTo, resetSlider } = useScrollTo()

  const scrollPrevious = () => {
    scrollTo(slideIndex - 1)
  }

  const onPressCancel = () => {
    if (scrollPrevious) {
      scrollPrevious()
    }
  }

  const onPressNext = async () => {
    try {
      const exchange = {
        items: {
          ...barterWeapons,
          ...barterClothings,
          ...barterConsumables,
          ...barterMiscObjects
        },
        ammo: barterAmmo,
        caps: barterCaps
      }
      await useCases.inventory.barter({ charId: actorId, ...exchange })
      await useCases.combat.doCombatAction({ combatId, action })
      Toast.show({ type: "custom", text1: "Action réalisée" })
      reset()
      resetSlider()
    } catch (error) {
      Toast.show({ type: "error", text1: "Erreur lors de l'enregistrement de l'action" })
    }
  }

  return (
    <Section contentContainerStyle={styles.ctaSection}>
      <GoBackButton onPress={onPressCancel} />
      <PlayButton onPress={onPressNext} />
    </Section>
  )
}

function PickUpItemSlide({ slideIndex }: SlideProps) {
  return (
    <DrawerSlide>
      <ScrollSection title="catégories">
        <Barter.Categories />
      </ScrollSection>
      <Spacer x={layout.globalPadding} />
      <Col style={styles.extend}>
        <Search />
        <ScrollSection title="LISTE" style={styles.extend}>
          <Barter.ObjectsList />
        </ScrollSection>
      </Col>
      <Spacer x={layout.globalPadding} />
      <Col style={styles.modCol}>
        <Barter.ModQuantity />
        <CtaSection slideIndex={slideIndex} />
      </Col>
    </DrawerSlide>
  )
}

export default memo(PickUpItemSlide)
