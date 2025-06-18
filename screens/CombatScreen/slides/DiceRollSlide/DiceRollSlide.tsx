import { StyleSheet, View } from "react-native"

import Character from "lib/character/Character"
import { Roll } from "lib/combat/combats.types"
import difficultyArray from "lib/combat/const/difficulty"
import {
  getActionId,
  getCurrentRoundId,
  getDiceRollData,
  getItemWithSkillFromId
} from "lib/combat/utils/combat-utils"

import Col from "components/Col"
import NumPad from "components/NumPad/NumPad"
import useNumPad from "components/NumPad/useNumPad"
import Section from "components/Section"
import DrawerSlide from "components/Slides/DrawerSlide"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"
import { useInventory } from "contexts/InventoryContext"
import { useActionApi, useActionForm } from "providers/ActionProvider"
import { useCombat } from "providers/CombatProvider"
import { useGetUseCases } from "providers/UseCasesProvider"
import colors from "styles/colors"
import layout from "styles/layout"

import AwaitGmSlide from "../AwaitGmSlide"
import NextButton from "../NextButton"
import SlideError, { slideErrors } from "../SlideError"
import NoRollSlide from "./NoRollSlide"

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
}

export default function DiceRollSlide({ scrollNext }: DiceRollSlideProps) {
  const useCases = useGetUseCases()

  const char = useCharacter()
  const inventory = useInventory()
  const { combat } = useCombat()

  const { setForm } = useActionApi()
  const form = useActionForm()

  let item
  if (form.actionType === "weapon") {
    item = char.unarmed
    const isHuman = char instanceof Character
    if (form.itemDbKey) {
      item = isHuman
        ? inventory.weaponsRecord[form.itemDbKey] ?? char.unarmed
        : char.equipedObjectsRecord.weapons[form.itemDbKey]
    }
  } else {
    item = getItemWithSkillFromId(form.itemDbKey, inventory)
  }

  const { skillLabel, totalSkillScore } = getDiceRollData({ ...form, item }, char)

  const { scoreStr, onPressKeypad } = useNumPad(form.roll?.actorDiceScore?.toString())

  const onPressConfirm = async (r: Roll) => {
    if (combat === null || !scrollNext) return
    setForm({ roll: r })
    await useCases.combat.updateAction({ combat, payload: { roll: r } })
    scrollNext()
  }

  if (combat === null) return <SlideError error={slideErrors.noCombatError} />

  const roundId = getCurrentRoundId(combat)
  const actionId = getActionId(combat)
  const currRoll = combat?.rounds?.[roundId]?.[actionId]?.roll
  const isAwaitingGm = currRoll === undefined

  if (isAwaitingGm) return <AwaitGmSlide messageCase="difficulty" />
  if (currRoll === false) return <NoRollSlide />

  const difficultyScore = currRoll?.difficultyModifier ?? 0
  const difficultyLvl = difficultyArray.find(e => difficultyScore <= e.threshold)

  const diceScore = parseInt(scoreStr, 10)
  const isValid = scoreStr.length > 0 && !Number.isNaN(diceScore)
  const prevRoll = combat.rounds?.[roundId]?.[actionId]?.roll
  const payload: Roll = {
    ...prevRoll,
    difficultyModifier: difficultyScore,
    actorDiceScore: diceScore,
    actorSkillScore: totalSkillScore
  }

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
          title={skillLabel}
          contentContainerStyle={styles.scoreContainer}
        >
          <Txt style={styles.score}>{totalSkillScore}</Txt>
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
