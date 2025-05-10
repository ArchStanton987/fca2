import { useCallback, useState } from "react"
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from "react-native"

import { useFocusEffect } from "expo-router"

import FontAwesome5 from "@expo/vector-icons/FontAwesome5"
import skillsMap from "lib/character/abilities/skills/skills"
import { getRandomArbitrary } from "lib/common/utils/dice-calc"
import Toast from "react-native-toast-message"

import DrawerPage from "components/DrawerPage"
import NumPad from "components/NumPad/NumPad"
import useNumPad from "components/NumPad/useNumPad"
import Section from "components/Section"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"
import { useCombat } from "providers/CombatProvider"
import { useGetUseCases } from "providers/UseCasesProvider"
import colors from "styles/colors"
import layout from "styles/layout"

import NextButton from "./slides/NextButton"

const styles = StyleSheet.create({
  digit: {
    fontSize: 20
  },
  digitContainer: {
    backgroundColor: colors.primColor,
    borderWidth: 2,
    borderColor: colors.secColor,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: 60
  },
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

export default function InitiativeScreen() {
  const useCases = useGetUseCases()

  const { combat, npcs, players } = useCombat()
  const contenders = { ...npcs, ...players }
  const character = useCharacter()
  const { isNpc } = character.meta
  const { skills } = character
  const { perceptionSkill } = skills.curr

  const { scoreStr, onPressKeypad, setScore } = useNumPad()
  const [isLoading, setIsLoading] = useState(false)

  const finalScore = perceptionSkill - parseInt(scoreStr, 10)
  const finalScoreStr = Number.isNaN(finalScore) ? "" : finalScore.toString()

  const onPressConfirm = async () => {
    if (Number.isNaN(finalScore) || combat === null) return
    const isScoreUnique = Object.values(contenders).every(
      c => c.combatData.initiative !== finalScore
    )
    if (!isScoreUnique) {
      Toast.show({
        type: "custom",
        text1: "Un autre personnage a déjà ce score, il faut relancer les dés !"
      })
      return
    }
    await useCases.combat.updateContender({
      combat,
      char: character,
      payload: { initiative: finalScore }
    })
  }

  const onPressDice = async () => {
    const newValue = getRandomArbitrary(1, 101)
    if (isNpc) {
      setScore(newValue.toString())
      return
    }
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setScore(newValue.toString())
    }, 3000)
  }

  useFocusEffect(
    useCallback(() => {
      Toast.show({ type: "custom", text1: "Faites un jet de D100 pour l'initiative" })
    }, [])
  )

  const isValid = scoreStr.length > 0 && !isLoading

  if (combat === null)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Txt>Impossible de récupérer le combat en cours</Txt>
      </View>
    )

  return (
    <DrawerPage>
      <Section title="score aux dés" contentContainerStyle={{ flex: 1, height: "100%" }}>
        <NumPad onPressKeyPad={onPressKeypad} />
      </Section>

      <Spacer x={layout.globalPadding} />

      <View style={{ flex: 1, minWidth: 100 }}>
        <Section
          style={{ flex: 1 }}
          title="SCORE FINAL"
          contentContainerStyle={styles.scoreContainer}
        >
          {isLoading ? (
            <ActivityIndicator size="large" color={colors.secColor} style={{ height: 50 }} />
          ) : (
            <Txt style={styles.score}>{finalScoreStr}</Txt>
          )}
        </Section>
        <Spacer y={layout.globalPadding} />

        <Section
          style={{ flex: 1 }}
          title="JET DE DÉ"
          contentContainerStyle={styles.scoreContainer}
        >
          {isLoading ? (
            <ActivityIndicator size="large" color={colors.secColor} style={{ height: 50 }} />
          ) : (
            <Txt style={styles.score}>{scoreStr}</Txt>
          )}
        </Section>
        <Spacer y={layout.globalPadding} />
        <Section
          style={{ flex: 1 }}
          title={skillsMap.perceptionSkill.label}
          contentContainerStyle={styles.scoreContainer}
        >
          <Txt style={styles.score}>{perceptionSkill}</Txt>
        </Section>
      </View>
      <Spacer x={layout.globalPadding} />

      <View style={{ flex: 1, minWidth: 100 }}>
        <Section
          style={{ flex: 1 }}
          contentContainerStyle={styles.scoreContainer}
          title="ALEATOIRE"
        >
          <TouchableOpacity onPress={() => onPressDice()} disabled={isLoading}>
            <FontAwesome5 name="dice-d20" size={45} color={colors.secColor} />
          </TouchableOpacity>
        </Section>
        <Spacer y={layout.globalPadding} />

        <Section title="valider" style={{ flex: 1 }} contentContainerStyle={styles.scoreContainer}>
          <NextButton onPress={onPressConfirm} size={55} disabled={isLoading || !isValid} />
        </Section>
      </View>
    </DrawerPage>
  )
}
