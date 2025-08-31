import { StyleSheet, TouchableOpacity } from "react-native"

import { limbsMap } from "lib/character/health/health"
import { LimbsHp } from "lib/character/health/health-types"

import Col from "components/Col"
import List from "components/List"
import Section from "components/Section"
import ScrollSection from "components/Section/ScrollSection"
import DrawerSlide from "components/Slides/DrawerSlide"
import { SlideProps } from "components/Slides/Slide.types"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useActionApi, useActionForm } from "providers/ActionProvider"
import { useCombat } from "providers/CombatProvider"
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
  const useCases = useGetUseCases()
  const { combat } = useCombat()
  const { aimZone = "" } = useActionForm()
  const { setForm } = useActionApi()

  const { scrollTo } = useScrollTo()

  const scrollNext = () => {
    scrollTo(slideIndex + 1)
  }

  const onPressPart = (id: keyof LimbsHp) => {
    setForm({ aimZone: id })
  }

  const onPressNext = async () => {
    if (!combat || !aimZone) return
    await useCases.combat.updateAction({ combat, payload: { aimZone } })
    scrollNext()
  }

  const limbsList = Object.values(limbsMap).map(e => e)
  return (
    <DrawerSlide>
      <ScrollSection title="que visez vous ?" style={{ flex: 1 }}>
        <List
          data={limbsList}
          keyExtractor={e => e.id}
          renderItem={({ item }) => {
            const isSelected = aimZone === item.id
            return (
              <TouchableOpacity
                onPress={() => onPressPart(item.id)}
                style={[styles.button, isSelected && styles.selected]}
              >
                <Txt>{item.label}</Txt>
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
              <Txt>Malus de visée : {limbsMap[aimZone].aimMalus}</Txt>
              <Txt>Bonus chance crit. : {limbsMap[aimZone].aimMalus}</Txt>
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
