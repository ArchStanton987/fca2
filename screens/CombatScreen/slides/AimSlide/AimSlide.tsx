import { StyleSheet, TouchableOpacity } from "react-native"

import { useLocalSearchParams } from "expo-router"

import { useCombatId } from "lib/character/combat-status/combat-status-provider"
import { limbsMap } from "lib/character/health/Health"
import { useHealth } from "lib/character/health/health-provider"
import { LimbId } from "lib/character/health/health.const"

import Col from "components/Col"
import List from "components/List"
import Section from "components/Section"
import ScrollSection from "components/Section/ScrollSection"
import DrawerSlide from "components/Slides/DrawerSlide"
import { SlideProps } from "components/Slides/Slide.types"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import {
  useActionActorId,
  useActionAimZone,
  useActionApi,
  useActionTargetId
} from "providers/ActionFormProvider"
import { useScrollTo } from "providers/SlidesProvider"
import { useGetUseCases } from "providers/UseCasesProvider"
import colors from "styles/colors"
import layout from "styles/layout"

import NextButton from "../NextButton"

const styles = StyleSheet.create({
  button: {
    padding: 15,
    borderColor: colors.secColor
  },
  selected: {
    backgroundColor: colors.terColor
  },
  centeredSection: {
    justifyContent: "center",
    alignItems: "center"
  }
})

export default function AimSlide({ slideIndex }: SlideProps) {
  const { charId } = useLocalSearchParams<{ charId: string }>()
  const useCases = useGetUseCases()
  const aimZone = useActionAimZone()
  const targetId = useActionTargetId()
  const { setForm } = useActionApi()

  const { scrollTo } = useScrollTo()

  const formActorId = useActionActorId()
  const actorId = formActorId === "" ? charId : formActorId
  const { data: combatId } = useCombatId(actorId)

  const scrollNext = () => {
    scrollTo(slideIndex + 1)
  }

  const onPressPart = (id: LimbId) => {
    setForm({ aimZone: id })
  }

  const onPressNext = async () => {
    if (!aimZone) return
    await useCases.combat.updateAction({ combatId, payload: { aimZone } })
    scrollNext()
  }

  const { data: targetLimbs } = useHealth(targetId ?? "", h => h.limbs)
  return (
    <DrawerSlide>
      <ScrollSection title="que visez vous ?" style={{ flex: 1 }}>
        <List
          data={Object.keys(targetLimbs) as LimbId[]}
          keyExtractor={e => e}
          renderItem={({ item }) => {
            const isSelected = aimZone === item
            return (
              <TouchableOpacity
                onPress={() => onPressPart(item)}
                style={[styles.button, isSelected && styles.selected]}
              >
                <Txt>{limbsMap[item].label}</Txt>
              </TouchableOpacity>
            )
          }}
        />
      </ScrollSection>

      <Spacer x={layout.globalPadding} />

      <Col style={{ width: 200 }}>
        <Section style={{ flex: 1 }} title="effets" contentContainerStyle={styles.centeredSection}>
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
  )
}
