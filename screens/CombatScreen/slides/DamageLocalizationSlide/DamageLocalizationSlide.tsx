import { StyleSheet, View } from "react-native"

import { limbsMap } from "lib/character/health/health"
import { LimbsHp } from "lib/character/health/health-types"

import NumPad from "components/NumPad/NumPad"
import useNumPad from "components/NumPad/useNumPad"
import Section from "components/Section"
import DrawerSlide from "components/Slides/DrawerSlide"
import { SlideProps } from "components/Slides/Slide.types"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useActionApi, useActionForm } from "providers/ActionProvider"
import { useCombat } from "providers/CombatProvider"
import { useGetUseCases } from "providers/UseCasesProvider"
import colors from "styles/colors"
import layout from "styles/layout"

import NextButton from "../NextButton"

const styles = StyleSheet.create({
  score: {
    color: colors.secColor,
    fontSize: 42,
    lineHeight: 50
  },
  scoreContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center"
  }
})

const getBodyPart = (scoreStr: string): keyof LimbsHp => {
  const score = parseInt(scoreStr, 10)
  if (Number.isNaN(score)) throw new Error("invalid score")
  // REWORKED MAP
  if (score === 69) return "groinHp"
  if (score <= 10) return "headHp"
  if (score <= 15) return "groinHp"
  if (score <= 26) return "leftLegHp"
  if (score <= 37) return "rightLegHp"
  if (score <= 48) return "leftArmHp"
  if (score <= 59) return "rightArmHp"
  if (score <= 80) return "leftTorsoHp"
  if (score <= 100) return "rightTorsoHp"
  throw new Error("invalid score")
}

type DamageLocalizationSlideProps = SlideProps & {}

export default function DamageLocalizationSlide({ scrollNext }: DamageLocalizationSlideProps) {
  const useCases = useGetUseCases()
  const { combat } = useCombat()
  const form = useActionForm()
  const { damageLocalization } = form
  const { setForm } = useActionApi()
  const { scoreStr, onPressKeypad } = useNumPad()

  const isScoreValid = scoreStr.length === 1 || scoreStr.length === 2

  const resetField = () => {
    setForm({ damageLocalization: undefined })
  }

  const submit = async () => {
    if (combat === null || !scrollNext) return
    if (!isScoreValid) throw new Error("invalid score")
    if (!damageLocalization) {
      const payload = { ...form, damageLocalization: getBodyPart(scoreStr) }
      await useCases.combat.updateAction({ combat, payload })
      setForm({ damageLocalization: getBodyPart(scoreStr) })
      return
    }
    scrollNext()
  }

  return (
    <DrawerSlide>
      <Section title="localisation des dégâts" contentContainerStyle={{ flex: 1, height: "100%" }}>
        <NumPad onPressKeyPad={onPressKeypad} />
      </Section>

      <Spacer x={layout.globalPadding} />

      <Section title="JET DE DÉ" style={{ flex: 1 }} contentContainerStyle={styles.scoreContainer}>
        <Txt style={styles.score}>{scoreStr}</Txt>
      </Section>

      <Spacer x={layout.globalPadding} />

      <View style={{ flex: 1, minWidth: 100 }}>
        <Section title="résultat" style={{ flex: 1 }} contentContainerStyle={styles.scoreContainer}>
          {damageLocalization ? <Txt>{limbsMap[damageLocalization].label}</Txt> : null}
        </Section>
        <Spacer y={layout.globalPadding} />

        <Section
          title={damageLocalization ? "suivant" : "voir"}
          contentContainerStyle={styles.scoreContainer}
        >
          <NextButton
            onLongPress={() => resetField()}
            disabled={!isScoreValid}
            onPress={() => submit()}
          />
        </Section>
      </View>
    </DrawerSlide>
  )
}
