import React from "react"
import { Image, TouchableOpacity, View } from "react-native"

import { router, useLocalSearchParams } from "expo-router"

import { limbsMap } from "lib/character/health/Health"
import { useHealth, useLimbHp } from "lib/character/health/health-provider"
import { LimbId } from "lib/character/health/health.const"
import { useUpdateHealthActions } from "lib/character/health/update-health-store"
import { useProgress } from "lib/character/progress/progress-provider"

import pipboy from "assets/images/pipboy.png"
import ProgressionBar from "components/ProgressionBar/ProgressionBar"
import Spacer from "components/Spacer"
import routes from "constants/routes"
import colors from "styles/colors"

import styles from "./HealthFigure.styles"

const getProgressionBarColor = (value: number, maxValue: number) => {
  const currHpPercent = (value / maxValue) * 100
  if (value <= 0) return colors.red
  if (currHpPercent < 25) return colors.orange
  if (currHpPercent < 50) return colors.yellow
  return colors.secColor
}

function Bar({ charId, limbId }: { charId: string; limbId: LimbId }) {
  const { squadId } = useLocalSearchParams<{ squadId: string }>()
  const { level } = useProgress(charId)
  const { data: limbHp = 0 } = useLimbHp(charId, limbId)

  const updateHealthActions = useUpdateHealthActions()

  const onPress = () => {
    updateHealthActions.selectCategory("limbs")
    updateHealthActions.selectLimb(limbId)
    const pathname = routes.modal.updateHealth
    const params = { charId, squadId }
    router.push({ pathname, params })
  }
  return (
    <TouchableOpacity onPress={onPress}>
      <ProgressionBar
        max={limbsMap[limbId].getMaxValue(level)}
        min={0}
        value={limbHp}
        color={getProgressionBarColor(limbHp, limbsMap[limbId].getMaxValue(level))}
        height={5}
        width={30}
      />
    </TouchableOpacity>
  )
}

export default function HealthFigure({ charId }: { charId: string }) {
  const { squadId } = useLocalSearchParams<{ squadId: string }>()
  const limbs = useHealth(charId, data => data.limbs)
  const { head, leftTorso, rightTorso, leftArm, rightArm, leftLeg, rightLeg, groin, body, tail } =
    limbs.data

  const onPressElement = (element: LimbId) => {
    const pathname = routes.modal.updateHealth
    const params = { initElement: element, charId, squadId }
    router.push({ pathname, params })
  }

  return (
    <View style={{ alignItems: "center" }}>
      {head !== undefined ? <Bar charId={charId} limbId="head" /> : null}
      <Spacer y={5} />
      <View style={styles.armsContainer}>
        {rightArm !== undefined ? <Bar charId={charId} limbId="rightArm" /> : null}
        {leftArm !== undefined ? <Bar charId={charId} limbId="leftArm" /> : null}
      </View>
      <TouchableOpacity onPress={() => onPressElement("leftTorso")}>
        <Image source={pipboy} style={styles.img} />
      </TouchableOpacity>
      <View style={styles.torsoContainer}>
        {rightTorso !== undefined ? <Bar charId={charId} limbId="rightTorso" /> : null}
        {leftTorso !== undefined ? <Bar charId={charId} limbId="leftTorso" /> : null}
        {body !== undefined ? <Bar charId={charId} limbId="body" /> : null}
      </View>

      <View style={styles.legsContainer}>
        {leftLeg !== undefined ? <Bar charId={charId} limbId="leftLeg" /> : null}
        {rightLeg !== undefined ? <Bar charId={charId} limbId="rightLeg" /> : null}
      </View>
      <Spacer y={5} />
      {groin !== undefined ? <Bar charId={charId} limbId="groin" /> : null}
      {tail !== undefined ? <Bar charId={charId} limbId="tail" /> : null}
    </View>
  )
}
