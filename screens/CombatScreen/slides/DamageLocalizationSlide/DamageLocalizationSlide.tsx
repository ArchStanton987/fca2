import { useState } from "react"
import { ActivityIndicator, StyleSheet, View } from "react-native"

import { limbsMap } from "lib/character/health/health"
import { getBodyPart } from "lib/combat/utils/combat-utils"

import NumPad from "components/NumPad/NumPad"
import useNumPad from "components/NumPad/useNumPad"
import Section from "components/Section"
import DrawerSlide from "components/Slides/DrawerSlide"
import { SlideProps } from "components/Slides/Slide.types"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"
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

type DamageLocalizationSlideProps = SlideProps & {}

export default function DamageLocalizationSlide({ scrollNext }: DamageLocalizationSlideProps) {
  const useCases = useGetUseCases()
  const { meta } = useCharacter()
  const { combat } = useCombat()
  const form = useActionForm()
  const { damageLocalization } = form
  const { setForm } = useActionApi()
  const { scoreStr, onPressKeypad } = useNumPad()

  const [isLoading, setIsLoading] = useState(false)

  const isScoreValid = (scoreStr.length > 0 && scoreStr.length <= 3) || !!damageLocalization

  const resetField = () => {
    setForm({ damageLocalization: undefined })
  }

  const submit = async () => {
    if (combat === null || !scrollNext) return
    if (!isScoreValid) throw new Error("invalid score")
    if (!damageLocalization) {
      setForm({ damageLocalization: getBodyPart(scoreStr) })
      setIsLoading(true)
      setTimeout(
        () => {
          setIsLoading(false)
        },
        meta.isNpc ? 0 : 1500
      )
      return
    }
    const payload = { damageLocalization: getBodyPart(scoreStr) }
    await useCases.combat.updateAction({ combat, payload })
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
          {isLoading ? <ActivityIndicator color={colors.secColor} size="large" /> : null}
          {damageLocalization && !isLoading ? (
            <Txt>{limbsMap[damageLocalization].label}</Txt>
          ) : null}
        </Section>
        <Spacer y={layout.globalPadding} />

        <Section
          title={damageLocalization ? "suivant" : "voir"}
          contentContainerStyle={styles.scoreContainer}
        >
          <NextButton
            onLongPress={() => resetField()}
            disabled={!isScoreValid || isLoading}
            onPress={() => submit()}
          />
        </Section>
      </View>
    </DrawerSlide>
  )
}
