import { useState } from "react"
import { TouchableOpacity, View } from "react-native"

import skillsMap from "lib/character/abilities/skills/skills"
import { SkillId } from "lib/character/abilities/skills/skills.types"
import useCases from "lib/common/use-cases"
import { CharStackScreenProps } from "nav/nav.types"

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
        {canRemove ? (
          <TouchableOpacity onPress={() => onModSkill("minus", skillId)}>
            <MinusIcon size={20} />
          </TouchableOpacity>
        ) : (
          <Spacer x={20} />
        )}
        <Spacer x={10} />
        <Txt style={styles.upValue}>{values.upValue}</Txt>
        <Spacer x={10} />
        {canAdd ? (
          <TouchableOpacity onPress={() => onModSkill("plus", skillId)}>
            <PlusIcon size={20} />
          </TouchableOpacity>
        ) : (
          <Spacer x={20} />
        )}
      </View>
      <Txt style={styles.totalValue}>{values.baseValue + values.upValue}</Txt>
    </View>
  )
}

export default function UpdateSkillsModal({ navigation }: CharStackScreenProps<"UpdateSkills">) {
  const { skills, progress, charId } = useCharacter()
  const { availableSkillPoints, usedSkillsPoints } = progress
  const { base, up } = skills

  const [newUpSkills, setNewUpskills] = useState(up)

  const assignedCount = Object.values(newUpSkills).reduce((acc, val) => acc + val, 0)
  const toAssignCount = usedSkillsPoints + availableSkillPoints - assignedCount

  const onModSkill = (modType: "plus" | "minus", skillId: SkillId) => {
    if (toAssignCount === 0 && modType === "plus") return
    if (modType === "minus" && newUpSkills[skillId] === up[skillId]) return
    setNewUpskills(prev => ({ ...prev, [skillId]: prev[skillId] + (modType === "plus" ? 1 : -1) }))
  }

  const onCancel = () => navigation.goBack()
  const onConfirm = () => useCases.abilities.updateUpSkills(charId, newUpSkills)

  return (
    <ModalBody>
      <Txt style={{ textAlign: "center" }}>Points de compétence à répartir : {toAssignCount}</Txt>
      <Spacer y={20} />
      <ScrollableSection title="COMPETENCES" style={{ flex: 1 }}>
        {Object.values(skillsMap).map(skill => {
          const baseValue = base[skill.id]
          const upValue = newUpSkills[skill.id]
          const values = { baseValue, upValue }
          const canAdd = toAssignCount > 0
          const canRemove = newUpSkills[skill.id] > up[skill.id]
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
