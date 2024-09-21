import { useState } from "react"
import { View } from "react-native"

import { router } from "expo-router"

import skillsMap from "lib/character/abilities/skills/skills"
import { SkillId } from "lib/character/abilities/skills/skills.types"

import ModalCta from "components/ModalCta/ModalCta"
import ScrollableSection from "components/ScrollableSection"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import MinusIcon from "components/icons/MinusIcon"
import PlusIcon from "components/icons/PlusIcon"
import ModalBody from "components/wrappers/ModalBody"
import routes from "constants/routes"
import { useCharacter } from "contexts/CharacterContext"
import { useSquad } from "contexts/SquadContext"
import colors from "styles/colors"

import styles from "./UpdateSkillsModal.styles"

type RowProps = {
  label: string
  skillId: SkillId
  values: { baseValue: number; upValue: number; newUp: number }
  onModSkill: (modType: "plus" | "minus", skillId: SkillId) => void
  canAdd: boolean
  canRemove: boolean
}

function Row({ label, skillId, values, onModSkill, canAdd, canRemove }: RowProps) {
  const newTotal = values.baseValue + values.upValue + values.newUp
  return (
    <View style={styles.rowContainer}>
      <Txt style={styles.label}>{label}</Txt>
      <Txt style={styles.baseValue}>{values.baseValue}</Txt>
      <Spacer x={40} />
      <Txt style={styles.upValue}>{values.upValue}</Txt>
      <Spacer x={40} />
      <MinusIcon
        onPress={() => onModSkill("minus", skillId)}
        size={25}
        color={canRemove ? colors.secColor : colors.quadColor}
      />
      <Txt style={[styles.newUpValue, values.newUp > 0 && { color: colors.secColor }]}>
        {values.newUp}
      </Txt>
      <PlusIcon
        onPress={() => onModSkill("plus", skillId)}
        size={25}
        color={canAdd ? colors.secColor : colors.quadColor}
      />

      <Spacer x={40} />
      <Txt style={[styles.totalValue, values.newUp > 0 && styles.totalValueSec]}>{newTotal}</Txt>
    </View>
  )
}

export default function UpdateSkillsModal() {
  const { squadId } = useSquad()
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

  const onCancel = () => router.dismiss(1)
  const onConfirm = async () => {
    router.push({
      pathname: routes.modal.updateSkillsConfirmation,
      params: { newUpSkills: JSON.stringify(newUpSkills), charId, squadId }
    })
  }

  return (
    <ModalBody>
      <Spacer y={10} />
      <Txt style={{ textAlign: "center" }}>Points de compétence à répartir : {toAssignCount}</Txt>
      <Spacer y={10} />
      <ScrollableSection title="COMPETENCES" style={{ flex: 1 }}>
        {Object.values(skillsMap).map(skill => {
          const baseValue = base[skill.id]
          const upValue = up[skill.id]
          const newUp = newUpSkills[skill.id] - up[skill.id]
          const values = { baseValue, upValue, newUp }
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
