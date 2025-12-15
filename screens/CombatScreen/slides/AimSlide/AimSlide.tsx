import { useCurrCharId } from "lib/character/character-store"
import { useCombatId } from "lib/character/combat-status/combat-status-provider"
import { limbsMap } from "lib/character/health/Health"

import Col from "components/Col"
import Section from "components/Section"
import ScrollSection from "components/Section/ScrollSection"
import DrawerSlide from "components/Slides/DrawerSlide"
import { SlideProps } from "components/Slides/Slide.types"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useActionActorId, useActionAimZone } from "providers/ActionFormProvider"
import { useScrollTo } from "providers/SlidesProvider"
import { useGetUseCases } from "providers/UseCasesProvider"
import layout from "styles/layout"

import NextButton from "../NextButton"
import styles from "./AimSlide.styles"
import AimSlideComponents from "./AimSlideComponents"

export default function AimSlide({ slideIndex }: SlideProps) {
  const charId = useCurrCharId()
  const useCases = useGetUseCases()
  const aimZone = useActionAimZone()

  const { scrollTo } = useScrollTo()

  const formActorId = useActionActorId()
  const actorId = formActorId === "" ? charId : formActorId
  const { data: combatId } = useCombatId(actorId)

  const scrollNext = () => {
    scrollTo(slideIndex + 1)
  }

  const onPressNext = async () => {
    if (!aimZone) return
    await useCases.combat.updateAction({ combatId, payload: { aimZone } })
    scrollNext()
  }

  return (
    <AimSlideComponents.TargetWrapper>
      <DrawerSlide>
        <ScrollSection title="que visez vous ?" style={{ flex: 1 }}>
          <AimSlideComponents.TargetLimbsList />
        </ScrollSection>

        <Spacer x={layout.globalPadding} />

        <Col style={{ width: 200 }}>
          <Section
            style={{ flex: 1 }}
            title="effets"
            contentContainerStyle={styles.centeredSection}
          >
            {aimZone ? (
              <>
                <Txt>Malus de visée : {limbsMap[aimZone].aim.aimMalus}</Txt>
                <Txt>Bonus chance crit. : {limbsMap[aimZone].aim.critBonus}</Txt>
              </>
            ) : null}
          </Section>

          <Spacer y={layout.globalPadding} />

          <Section title="suivant" contentContainerStyle={styles.centeredSection}>
            <NextButton disabled={!aimZone} onPress={onPressNext} />
          </Section>
        </Col>
      </DrawerSlide>
    </AimSlideComponents.TargetWrapper>
  )
}
