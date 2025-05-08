import skillsMap from "lib/character/abilities/skills/skills"
import { SkillId } from "lib/character/abilities/skills/skills.types"
import { getCurrentActionId, getCurrentRoundId } from "lib/combat/utils/combat-utils"

import Col from "components/Col"
import Row from "components/Row"
import Section from "components/Section"
import DrawerSlide from "components/Slides/DrawerSlide"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import { useCharacter } from "contexts/CharacterContext"
import { useCombat } from "providers/CombatProvider"
import layout from "styles/layout"

import NextButton from "./NextButton"

type DiceResultSlideProps = {
  scrollNext?: () => void
  skillId: SkillId
}

export default function DiceResultSlide({ skillId, scrollNext }: DiceResultSlideProps) {
  const { meta, charId } = useCharacter()
  const { combat } = useCombat()
  const roundId = getCurrentRoundId(combat)
  const actionId = getCurrentActionId(combat)

  if (!combat) return <Txt>Impossible de récupérer le combat en cours</Txt>

  const roll = combat.rounds?.[roundId]?.[actionId]?.roll

  if (roll === undefined) return <Txt>En attente du MJ</Txt>
  if (roll === null) return <Txt>Pa de jet</Txt>

  const { actorDiceScore = 0, actorSkillScore = 0, difficultyModifier = 0 } = roll ?? {}
  const contenderType = meta.isNpc ? "npcs" : "players"
  const actionBonus = combat[contenderType][charId]?.actionBonus ?? 0

  const score = actorSkillScore - actorDiceScore + actionBonus
  const finalScore = score - difficultyModifier

  const submit = () => {}

  return (
    <DrawerSlide>
      <Section title="résultats" style={{ flex: 1 }} contentContainerStyle={{ flex: 1 }}>
        <Row style={{ justifyContent: "center", alignItems: "flex-end" }}>
          <Col style={{ alignItems: "center" }}>
            <Txt>Compétence</Txt>
            <Txt>{skillsMap[skillId].label}</Txt>
            <Txt style={{ fontSize: 35 }}>{actorSkillScore}</Txt>
          </Col>
          <Spacer x={10} />
          <Txt style={{ fontSize: 35 }}>-</Txt>
          <Spacer x={10} />
          <Col style={{ alignItems: "center" }}>
            <Txt>Jet de dé</Txt>
            <Txt style={{ fontSize: 35 }}>{actorDiceScore}</Txt>
          </Col>
          <Spacer x={10} />
          <Txt style={{ fontSize: 35 }}>+</Txt>
          <Spacer x={10} />
          <Col style={{ alignItems: "center" }}>
            <Txt>Bonus / Malus</Txt>
            <Txt style={{ fontSize: 35 }}>{actionBonus}</Txt>
          </Col>
          <Spacer x={10} />
          <Txt style={{ fontSize: 35 }}>=</Txt>
          <Spacer x={10} />
          <Col style={{ alignItems: "center" }}>
            <Txt>Score</Txt>
            <Txt style={{ fontSize: 35 }}>{score}</Txt>
          </Col>
        </Row>

        <Spacer y={20} />

        <Row style={{ justifyContent: "center", alignItems: "flex-end" }}>
          <Col style={{ alignItems: "center" }}>
            <Txt>Score</Txt>
            <Txt style={{ fontSize: 35 }}>{score}</Txt>
          </Col>
          <Spacer x={10} />
          <Txt style={{ fontSize: 35 }}>+</Txt>
          <Spacer x={10} />
          <Col style={{ alignItems: "center" }}>
            <Txt>Difficulté</Txt>
            <Txt style={{ fontSize: 35 }}>{difficultyModifier}</Txt>
          </Col>
          <Spacer x={10} />
          <Txt style={{ fontSize: 35 }}>=</Txt>
          <Spacer x={10} />
          <Col style={{ alignItems: "center" }}>
            <Txt>Score final</Txt>
            <Txt style={{ fontSize: 45 }}>{finalScore}</Txt>
          </Col>
        </Row>
      </Section>

      <Spacer x={layout.globalPadding} />
      <Col style={{ width: 100 }}>
        <Section
          style={{ flex: 1 }}
          contentContainerStyle={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          {finalScore > 0 ? <Txt>Bravo!</Txt> : <Txt>Échec</Txt>}
        </Section>
        <Spacer y={layout.globalPadding} />
        <Section
          title="suivant"
          contentContainerStyle={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <NextButton onPress={submit} />
        </Section>
      </Col>
    </DrawerSlide>
  )
}
