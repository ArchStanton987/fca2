import React from "react"
import { Image, TouchableOpacity, View } from "react-native"

import { router } from "expo-router"

import { useCharInfo, useHealth } from "lib/character/character-provider"
import { LimbId, limbsMap } from "lib/character/health/healthMap"

import pipboy from "assets/images/pipboy.png"
import ProgressionBar from "components/ProgressionBar/ProgressionBar"
import Spacer from "components/Spacer"
import routes from "constants/routes"
import { useSquad } from "contexts/SquadContext"
import colors from "styles/colors"

import styles from "./HealthFigure.styles"

const smallBarProps = {
  height: 5,
  width: 30
}

const getProgressionBarColor = (value: number, maxValue: number) => {
  const currHpPercent = (value / maxValue) * 100
  if (value <= 0) return colors.red
  if (currHpPercent < 25) return colors.orange
  if (currHpPercent < 50) return colors.yellow
  return colors.secColor
}

type BarProps = {
  limbId: LimbId
  limbHp: number
  onPress: (id: LimbId) => void
}
function Bar({ limbId, limbHp, onPress }: BarProps) {
  return (
    <TouchableOpacity onPress={() => onPress(limbId)}>
      <ProgressionBar
        max={limbsMap[limbId].maxHp}
        min={0}
        value={limbHp}
        color={getProgressionBarColor(limbHp, limbsMap.head.maxHp)}
        {...smallBarProps}
      />
    </TouchableOpacity>
  )
}

export default function HealthFigure() {
  const { squadId } = useSquad()
  const { charId } = useCharInfo()
  const { limbs } = useHealth()
  const { head, leftTorso, rightTorso, leftArm, rightArm, leftLeg, rightLeg, groin, body, tail } =
    limbs

  const onPressElement = (element: LimbId) => {
    const pathname = routes.modal.updateHealth
    const params = { initElement: element, charId, squadId }
    router.push({ pathname, params })
  }

  return (
    <View style={{ alignItems: "center" }}>
      {head !== undefined ? <Bar limbHp={head} limbId="head" onPress={onPressElement} /> : null}
      <Spacer y={5} />
      <View style={styles.armsContainer}>
        {rightArm !== undefined ? (
          <Bar limbHp={rightArm} limbId="rightArm" onPress={onPressElement} />
        ) : null}
        {leftArm !== undefined ? (
          <Bar limbHp={leftArm} limbId="leftArm" onPress={onPressElement} />
        ) : null}
      </View>
      <TouchableOpacity onPress={() => onPressElement("leftTorso")}>
        <Image source={pipboy} style={styles.img} />
      </TouchableOpacity>
      <View style={styles.torsoContainer}>
        {rightTorso !== undefined ? (
          <Bar limbHp={rightTorso} limbId="rightTorso" onPress={onPressElement} />
        ) : null}
        {leftTorso !== undefined ? (
          <Bar limbHp={leftTorso} limbId="leftTorso" onPress={onPressElement} />
        ) : null}
        {body !== undefined ? <Bar limbHp={body} limbId="body" onPress={onPressElement} /> : null}
      </View>

      <View style={styles.legsContainer}>
        {leftLeg !== undefined ? (
          <Bar limbHp={leftLeg} limbId="leftLeg" onPress={onPressElement} />
        ) : null}
        {rightLeg !== undefined ? (
          <Bar limbHp={rightLeg} limbId="rightLeg" onPress={onPressElement} />
        ) : null}
      </View>
      <Spacer y={5} />
      {groin !== undefined ? <Bar limbHp={groin} limbId="groin" onPress={onPressElement} /> : null}
      {tail !== undefined ? <Bar limbHp={tail} limbId="tail" onPress={onPressElement} /> : null}
    </View>
  )
}
