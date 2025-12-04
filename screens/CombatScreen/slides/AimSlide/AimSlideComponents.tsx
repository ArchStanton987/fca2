import { ReactNode } from "react"
import { TouchableOpacity } from "react-native"

import { limbsMap } from "lib/character/health/Health"
import { useHealth } from "lib/character/health/health-provider"
import { LimbId } from "lib/character/health/health.const"

import List from "components/List"
import Txt from "components/Txt"
import { useActionAimZone, useActionApi, useActionTargetId } from "providers/ActionFormProvider"

import AwaitTargetSlide from "../wait-slides/AwaitTargetSlide"
import styles from "./AimSlide.styles"

function LimbListElement({ limbId }: { limbId: LimbId }) {
  const { setForm } = useActionApi()
  const aimZone = useActionAimZone()
  const onPressPart = (id: LimbId) => {
    setForm({ aimZone: id })
  }
  const isSelected = aimZone === limbId
  return (
    <TouchableOpacity
      onPress={() => onPressPart(limbId)}
      style={[styles.button, isSelected && styles.selected]}
    >
      <Txt>{limbsMap[limbId].label}</Txt>
    </TouchableOpacity>
  )
}

function TargetLimbsList() {
  const targetId = useActionTargetId() ?? ""
  const { data: targetLimbs } = useHealth(targetId, h => h.limbs)
  return (
    <List
      data={Object.keys(targetLimbs) as LimbId[]}
      keyExtractor={e => e}
      renderItem={({ item }) => <LimbListElement limbId={item} />}
    />
  )
}

function TargetWrapper({ children }: { children: ReactNode }) {
  const targetId = useActionTargetId()
  if (!targetId) return <AwaitTargetSlide />
  return children
}

export default { TargetLimbsList, LimbListElement, TargetWrapper }
