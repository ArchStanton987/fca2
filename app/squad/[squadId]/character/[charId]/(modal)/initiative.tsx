import { useState } from "react"
import {
  ActivityIndicator,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  View
} from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import Feather from "@expo/vector-icons/Feather"
import FontAwesome5 from "@expo/vector-icons/FontAwesome5"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { getRandomArbitrary } from "lib/common/utils/dice-calc"

import ModalCta from "components/ModalCta/ModalCta"
import Row from "components/Row"
import Section from "components/Section"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import ModalBody from "components/wrappers/ModalBody"
import { useCharacter } from "contexts/CharacterContext"
import { useGetUseCases } from "providers/UseCasesProvider"
import colors from "styles/colors"
import layout from "styles/layout"

type InitiativeModalParams = {
  charId: string
  combatId: string
  charType: "players" | "enemies"
}

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

export default function InitiativeModal() {
  const { charId, combatId, charType = "players" } = useLocalSearchParams<InitiativeModalParams>()

  const useCases = useGetUseCases()

  const character = useCharacter()
  const { skills } = character
  const { perceptionSkill } = skills.curr

  const [initStr, setInitiative] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const finalScore = perceptionSkill - parseInt(initStr, 10)
  const finalScoreStr = Number.isNaN(finalScore) ? "" : finalScore.toString()

  const onPressConfirm = async () => {
    const initiative = parseInt(initStr, 10)
    if (Number.isNaN(initiative)) return
    await useCases.combat.updateContender({
      id: combatId,
      playerId: charId,
      charType,
      initiative: finalScore
    })
    router.dismiss()
  }

  const onPressDice = async () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      const newValue = getRandomArbitrary(1, 101)
      setInitiative(newValue.toString())
    }, 3000)
  }

  const onPressDigit = (digit: string) => {
    if (initStr.length < 2) {
      setInitiative(prev => prev + digit)
    }
  }
  const onPressDel = () => {
    if (initStr.length > 0) {
      setInitiative(prev => prev.slice(0, -1))
    }
  }
  const onPressClear = () => {
    setInitiative("")
  }

  const cancel = () => {
    const isValid = initStr.length > 0 && initStr !== ""
    if (!isValid) return
    router.dismiss()
  }

  // TODO: REFACTOR
  return (
    <ModalBody>
      <Txt style={{ textAlign: "center" }}>
        Veuillez entrer votre score d&apos;initiative, ou appuyer sur le d20
      </Txt>
      <Spacer y={25} />
      <Row style={{ flex: 1 }}>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Row style={{ flex: 1 }}>
            <TouchableHighlight style={styles.digitContainer} onPress={() => onPressDigit("7")}>
              <Txt style={styles.digit}>7</Txt>
            </TouchableHighlight>
            <Spacer x={20} />
            <TouchableHighlight style={styles.digitContainer} onPress={() => onPressDigit("8")}>
              <Txt style={styles.digit}>8</Txt>
            </TouchableHighlight>
            <Spacer x={20} />
            <TouchableHighlight style={styles.digitContainer} onPress={() => onPressDigit("9")}>
              <Txt style={styles.digit}>9</Txt>
            </TouchableHighlight>
          </Row>
          <Spacer y={15} />
          <Row style={{ flex: 1 }}>
            <TouchableHighlight style={styles.digitContainer} onPress={() => onPressDigit("4")}>
              <Txt style={styles.digit}>4</Txt>
            </TouchableHighlight>
            <Spacer x={20} />
            <TouchableHighlight style={styles.digitContainer} onPress={() => onPressDigit("5")}>
              <Txt style={styles.digit}>5</Txt>
            </TouchableHighlight>
            <Spacer x={20} />
            <TouchableHighlight style={styles.digitContainer} onPress={() => onPressDigit("6")}>
              <Txt style={styles.digit}>6</Txt>
            </TouchableHighlight>
          </Row>
          <Spacer y={15} />
          <Row style={{ flex: 1 }}>
            <TouchableHighlight style={styles.digitContainer} onPress={() => onPressDigit("1")}>
              <Txt style={styles.digit}>1</Txt>
            </TouchableHighlight>
            <Spacer x={20} />
            <TouchableHighlight style={styles.digitContainer} onPress={() => onPressDigit("2")}>
              <Txt style={styles.digit}>2</Txt>
            </TouchableHighlight>
            <Spacer x={20} />
            <TouchableHighlight style={styles.digitContainer} onPress={() => onPressDigit("3")}>
              <Txt style={styles.digit}>3</Txt>
            </TouchableHighlight>
          </Row>
          <Spacer y={15} />
          <Row style={{ flex: 1 }}>
            <TouchableHighlight style={styles.digitContainer} onPress={onPressDel}>
              <Feather name="delete" size={20} color={colors.secColor} />
            </TouchableHighlight>
            <Spacer x={20} />
            <TouchableHighlight style={styles.digitContainer} onPress={() => onPressDigit("0")}>
              <Txt style={styles.digit}>0</Txt>
            </TouchableHighlight>
            <Spacer x={20} />
            <TouchableHighlight style={styles.digitContainer} onPress={onPressClear}>
              <MaterialIcons name="clear" size={20} color={colors.secColor} />
            </TouchableHighlight>
          </Row>
        </View>

        <Spacer x={layout.globalPadding} />

        <View style={{ width: 160 }}>
          <Section
            style={{ flex: 1 }}
            title="JET DE DÉ"
            contentContainerStyle={styles.scoreContainer}
          >
            {isLoading ? (
              <ActivityIndicator size="large" color={colors.secColor} style={{ height: 50 }} />
            ) : (
              <Txt style={styles.score}>{initStr}</Txt>
            )}
          </Section>

          <Spacer y={layout.globalPadding} />

          <Section
            style={{ flex: 1 }}
            title="COMPETENCE"
            contentContainerStyle={styles.scoreContainer}
          >
            <Txt style={styles.score}>{perceptionSkill}</Txt>
          </Section>
        </View>

        <Spacer x={layout.globalPadding} />

        <View style={{ width: 160 }}>
          <Section style={{ flex: 1 }} title="SUCCES" contentContainerStyle={styles.scoreContainer}>
            {isLoading ? (
              <ActivityIndicator size="large" color={colors.secColor} style={{ height: 50 }} />
            ) : (
              <Txt style={styles.score}>{finalScoreStr}</Txt>
            )}
          </Section>

          <Spacer y={layout.globalPadding} />

          <Section
            style={{ flex: 1 }}
            title="JET ALEATOIRE"
            contentContainerStyle={styles.scoreContainer}
          >
            <TouchableOpacity onPress={() => onPressDice()} disabled={isLoading}>
              <FontAwesome5 name="dice-d20" size={45} color={colors.secColor} />
            </TouchableOpacity>
          </Section>
        </View>
      </Row>

      <Spacer y={layout.globalPadding} />

      <ModalCta onPressConfirm={onPressConfirm} onPressCancel={cancel} />
    </ModalBody>
  )
}
