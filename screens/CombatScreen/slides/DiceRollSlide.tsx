import { StyleSheet, View } from "react-native"

import skillsMap from "lib/character/abilities/skills/skills"
import { SkillId } from "lib/character/abilities/skills/skills.types"
import { Roll } from "lib/combat/combats.types"
import { getCurrentActionId, getCurrentRoundId } from "lib/combat/utils/combat-utils"

import Col from "components/Col"
import NumPad from "components/NumPad/NumPad"
import useNumPad from "components/NumPad/useNumPad"
import Section from "components/Section"
import DrawerSlide from "components/Slides/DrawerSlide"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"
import { useCombat } from "providers/CombatProvider"
import { useGetUseCases } from "providers/UseCasesProvider"
import colors from "styles/colors"
import layout from "styles/layout"

import { difficultyArray } from "./ActionTypeSlide/info/DifficultyInfo"
import AwaitGmSlide from "./AwaitGmSlide"
import NextButton from "./NextButton"

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

type DiceRollSlideProps = {
  scrollNext?: () => void
  skillId: SkillId
}

export default function DiceRollSlide({ skillId, scrollNext }: DiceRollSlideProps) {
  const useCases = useGetUseCases()

  const { combat } = useCombat()
  const character = useCharacter()
  // const { isNpc } = character.meta
  const { skills } = character
  const actorSkillScore = skills.curr[skillId]

  const { scoreStr, onPressKeypad } = useNumPad()

  const onPressConfirm = async (r: Roll) => {
    if (combat === null) return
    await useCases.combat.updateAction({ combat, payload: { roll: r } })
    if (!scrollNext) return
    scrollNext()
  }

  if (combat === null)
    return (
      <DrawerSlide>
        <Txt>Impossible de récupérer le combat en cours</Txt>
      </DrawerSlide>
    )
  const roundId = getCurrentRoundId(combat)
  const actionId = getCurrentActionId(combat)
  const currActionRoll = combat?.rounds?.[roundId]?.[actionId]?.roll
  const isAwaitingGm = currActionRoll === undefined
  const difficultyScore = currActionRoll?.difficultyModifier ?? 0
  const difficultyLvl = difficultyArray.find(e => difficultyScore <= e.threshold)

  const diceScore = parseInt(scoreStr, 10)
  const isValid = scoreStr.length > 0 && !Number.isNaN(diceScore)
  const prevRoll = combat.rounds?.[roundId]?.[actionId]?.roll
  const payload: Roll = {
    ...prevRoll,
    difficultyModifier: difficultyScore,
    actorDiceScore: diceScore,
    actorSkillScore
  }

  if (isAwaitingGm) return <AwaitGmSlide />

  return (
    <DrawerSlide>
      <Section title="score aux dés" contentContainerStyle={{ flex: 1, height: "100%" }}>
        <NumPad onPressKeyPad={onPressKeypad} />
      </Section>

      <Spacer x={layout.globalPadding} />

      <Col style={{ flex: 1 }}>
        <Section
          style={{ flex: 1 }}
          title="JET DE DÉ"
          contentContainerStyle={styles.scoreContainer}
        >
          <Txt style={styles.score}>{scoreStr}</Txt>
        </Section>
        <Spacer y={layout.globalPadding} />
        <Section
          style={{ flex: 1 }}
          title={skillsMap[skillId].label}
          contentContainerStyle={styles.scoreContainer}
        >
          <Txt style={styles.score}>{actorSkillScore}</Txt>
        </Section>
      </Col>

      <Spacer x={layout.globalPadding} />

      <View style={{ flex: 1, minWidth: 100 }}>
        <Section
          title="difficulté"
          style={{ flex: 1 }}
          contentContainerStyle={styles.scoreContainer}
        >
          {difficultyLvl ? (
            <>
              <Txt style={{ fontSize: 22, color: difficultyLvl.color }}>{difficultyLvl.label}</Txt>
              <Spacer y={layout.globalPadding} />
              <Txt style={{ fontSize: 18, color: difficultyLvl.color }}>
                {difficultyLvl.modLabel}
              </Txt>
            </>
          ) : null}
        </Section>
        <Spacer y={layout.globalPadding} />

        <Section title="valider" contentContainerStyle={styles.scoreContainer}>
          <NextButton onPress={() => onPressConfirm(payload)} size={55} disabled={!isValid} />
        </Section>
      </View>
    </DrawerSlide>
  )
}
