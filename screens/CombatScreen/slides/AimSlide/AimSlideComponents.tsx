import { ReactNode } from "react"
import { TouchableOpacity } from "react-native"

import { useQuery } from "@tanstack/react-query"
import { limbsMap } from "lib/character/health/Health"
import { getHealthOptions } from "lib/character/health/health-provider"
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

function Limbs({ targetId }: { targetId: string }) {
  const { data: targetLimbs = [] } = useQuery({
    ...getHealthOptions(targetId),
    select: h => Object.keys(h.limbs) as LimbId[]
  })
  return (
    <List
      data={targetLimbs}
      keyExtractor={e => e}
      renderItem={({ item }) => <LimbListElement limbId={item} />}
    />
  )
}

function TargetLimbsList() {
  const targetId = useActionTargetId() ?? ""
  if (!targetId || targetId === "other") return null
  return <Limbs targetId={targetId} />
}

function TargetWrapper({ children }: { children: ReactNode }) {
  const targetId = useActionTargetId()
  if (!targetId) return <AwaitTargetSlide />
  return children
}

export default { TargetLimbsList, LimbListElement, TargetWrapper }
