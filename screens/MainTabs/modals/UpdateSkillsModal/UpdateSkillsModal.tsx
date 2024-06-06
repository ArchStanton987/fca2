import { useState } from "react"
import { View } from "react-native"

import { router } from "expo-router"

import skillsMap from "lib/character/abilities/skills/skills"
import { SkillId } from "lib/character/abilities/skills/skills.types"
import useCases from "lib/common/use-cases"

import ModalCta from "components/ModalCta/ModalCta"
import ScrollableSection from "components/ScrollableSection"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import MinusIcon from "components/icons/MinusIcon"
import PlusIcon from "components/icons/PlusIcon"
import ModalBody from "components/wrappers/ModalBody"
import { useCharacter } from "contexts/CharacterContext"

import styles from "./UpdateSkillsModal.styles"

type RowProps = {
  label: string
  skillId: SkillId
  values: { baseValue: number; upValue: number }
  onModSkill: (modType: "plus" | "minus", skillId: SkillId) => void
  canAdd: boolean
  canRemove: boolean
}

function Row({ label, skillId, values, onModSkill, canAdd, canRemove }: RowProps) {
  return (
    <View style={styles.rowContainer}>
      <Txt style={styles.label}>{label}</Txt>
      <Txt style={styles.baseValue}>{values.baseValue}</Txt>
      <View style={styles.modContainer}>
        {canRemove ? <MinusIcon onPress={() => onModSkill("minus", skillId)} /> : <Spacer x={20} />}
        <Spacer x={10} />
        <Txt style={styles.upValue}>{values.upValue}</Txt>
        <Spacer x={10} />
        {canAdd ? <PlusIcon onPress={() => onModSkill("plus", skillId)} /> : <Spacer x={20} />}
      </View>
      <Txt style={styles.totalValue}>{values.baseValue + values.upValue}</Txt>
    </View>
  )
}

export default function UpdateSkillsModal() {
  const { skills, progress, charId } = useCharacter()
  const { base, up } = skills

  const [prevUpSkills, setPrevUpSkills] = useState(up)
  const unusedSkillPoints =
    progress.availableSkillPoints - Object.values(prevUpSkills).reduce((acc, val) => acc + val, 0)

  const onModSkill = (modType: "plus" | "minus", skillId: SkillId) => {
    if (unusedSkillPoints === 0 && modType === "plus") return
    if (modType === "minus" && prevUpSkills[skillId] === up[skillId]) return
    setPrevUpSkills(prev => ({ ...prev, [skillId]: prev[skillId] + (modType === "plus" ? 1 : -1) }))
  }

  const onCancel = () => router.dismiss(1)
  const onConfirm = () => useCases.abilities.updateUpSkills(charId, prevUpSkills)

  return (
    <ModalBody>
      <Txt style={{ textAlign: "center" }}>
        Points de compétence à répartir : {unusedSkillPoints}
      </Txt>
      <Spacer y={20} />
      <ScrollableSection title="COMPETENCES" style={{ flex: 1 }}>
        {Object.values(skillsMap).map(skill => {
          const baseValue = base[skill.id]
          const upValue = prevUpSkills[skill.id]
          const values = { baseValue, upValue }
          const canAdd = unusedSkillPoints > 0
          const canRemove = prevUpSkills[skill.id] > up[skill.id]
          return (
            <Row
              key={skill.id}
              skillId={skill.id}
              label={skill.label}
              values={values}
              onModSkill={onModSkill}
              canAdd={canAdd}
              canRemove={canRemove}
            />
          )
        })}
      </ScrollableSection>
      <Spacer y={20} />
      <ModalCta onPressCancel={onCancel} onPressConfirm={onConfirm} />
    </ModalBody>
  )
}
