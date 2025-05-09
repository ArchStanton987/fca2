import { StyleSheet } from "react-native"

import skillsMap from "lib/character/abilities/skills/skills"
import { SkillId } from "lib/character/abilities/skills/skills.types"
import { getCurrentActionId, getCurrentRoundId } from "lib/combat/utils/combat-utils"
import Toast from "react-native-toast-message"

import Col from "components/Col"
import Row from "components/Row"
import Section from "components/Section"
import DrawerSlide from "components/Slides/DrawerSlide"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"
import { useActionApi, useActionForm } from "providers/ActionProvider"
import { useCombat } from "providers/CombatProvider"
import { useGetUseCases } from "providers/UseCasesProvider"
import layout from "styles/layout"

import NextButton from "./NextButton"

const styles = StyleSheet.create({
  centeredSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  scoreContainer: {
    alignItems: "center"
  },
  score: {
    fontSize: 35
  },
  finalScore: {
    fontSize: 45
  },
  scoreDetailRow: {
    justifyContent: "center",
    alignItems: "flex-end"
  }
})

type DiceResultSlideProps = {
  skillId: SkillId
}

export default function DiceResultSlide({ skillId }: DiceResultSlideProps) {
  const useCases = useGetUseCases()
  const { meta, charId } = useCharacter()
  const { combat, npcs, players } = useCombat()
  const form = useActionForm()
  const { reset } = useActionApi()
  const roundId = getCurrentRoundId(combat)
  const actionId = getCurrentActionId(combat)

  if (!combat) return <Txt>Impossible de récupérer le combat en cours</Txt>

  const roll = combat.rounds?.[roundId]?.[actionId]?.roll

  if (roll === undefined) return <Txt>En attente du MJ</Txt>
  if (roll === null) return <Txt>Pas de jet</Txt>

  const { actorDiceScore = 0, actorSkillScore = 0, difficultyModifier = 0 } = roll ?? {}
  const contenderType = meta.isNpc ? "npcs" : "players"
  const actionBonus = combat[contenderType][charId]?.actionBonus ?? 0

  const score = actorSkillScore - actorDiceScore + actionBonus
  const finalScore = score - difficultyModifier

  const submit = async () => {
    try {
      if (form.actionType === "movement") {
        await useCases.combat.movementAction({
          combat,
          contenders: { ...players, ...npcs },
          action: JSON.parse(JSON.stringify(form))
        })
        reset()
        Toast.show({ type: "custom", text1: "Action réalisée !" })
      }
    } catch (error) {
      Toast.show({ type: "error", text1: "Erreur lors de l'enregistrement de l'action" })
    }
  }

  return (
    <DrawerSlide>
      <Section title="résultats" style={{ flex: 1 }} contentContainerStyle={{ flex: 1 }}>
        <Row style={styles.scoreDetailRow}>
          <Col style={styles.scoreContainer}>
            <Txt>Compétence</Txt>
            <Txt>{skillsMap[skillId].label}</Txt>
            <Txt style={styles.score}>{actorSkillScore}</Txt>
          </Col>
          <Spacer x={10} />
          <Txt style={styles.score}>-</Txt>
          <Spacer x={10} />
          <Col style={styles.scoreContainer}>
            <Txt>Jet de dé</Txt>
            <Txt style={styles.score}>{actorDiceScore}</Txt>
          </Col>
          <Spacer x={10} />
          <Txt style={styles.score}>+</Txt>
          <Spacer x={10} />
          <Col style={styles.scoreContainer}>
            <Txt>Bonus / Malus</Txt>
            <Txt style={styles.score}>{actionBonus}</Txt>
          </Col>
          <Spacer x={10} />
          <Txt style={styles.score}>=</Txt>
          <Spacer x={10} />
          <Col style={styles.scoreContainer}>
            <Txt>Score</Txt>
            <Txt style={styles.score}>{score}</Txt>
          </Col>
        </Row>

        <Spacer y={20} />

        <Row style={styles.scoreDetailRow}>
          <Col style={styles.scoreContainer}>
            <Txt>Score</Txt>
            <Txt style={styles.score}>{score}</Txt>
          </Col>
          <Spacer x={10} />
          <Txt style={styles.score}>+</Txt>
          <Spacer x={10} />
          <Col style={styles.scoreContainer}>
            <Txt>Difficulté</Txt>
            <Txt style={styles.score}>{difficultyModifier}</Txt>
          </Col>
          <Spacer x={10} />
          <Txt style={styles.score}>=</Txt>
          <Spacer x={10} />
          <Col style={styles.scoreContainer}>
            <Txt>Score final</Txt>
            <Txt style={styles.finalScore}>{finalScore}</Txt>
          </Col>
        </Row>
      </Section>

      <Spacer x={layout.globalPadding} />
      <Col style={{ width: 100 }}>
        <Section style={{ flex: 1 }} contentContainerStyle={styles.centeredSection}>
          {finalScore > 0 ? <Txt>Réussite !</Txt> : <Txt>Échec</Txt>}
        </Section>
        <Spacer y={layout.globalPadding} />
        <Section title="suivant" contentContainerStyle={styles.centeredSection}>
          <NextButton size={45} onPress={submit} />
        </Section>
      </Col>
    </DrawerSlide>
  )
}
