import React from "react"
import { Image, View } from "react-native"

import { limbsMap } from "lib/character/health/health"

import pipboy from "assets/images/pipboy.png"
import ProgressionBar from "components/ProgressionBar/ProgressionBar"
import Spacer from "components/Spacer"
import { useCharacter } from "contexts/CharacterContext"

import styles from "./HealthFigure.styles"

const smallBarProps = {
  height: 5,
  width: 30
}

export default function HealthFigure() {
  const character = useCharacter()
  const { limbsHp } = character.health

  return (
    <View style={{ alignItems: "center" }}>
      <ProgressionBar
        max={limbsMap.headHp.maxValue}
        min={0}
        value={limbsHp.headHp}
        {...smallBarProps}
      />
      <Spacer y={5} />
      <View style={styles.armsContainer}>
        <ProgressionBar
          {...smallBarProps}
          max={limbsMap.leftArmHp.maxValue}
          min={0}
          value={limbsHp.leftArmHp}
        />
        <ProgressionBar
          {...smallBarProps}
          max={limbsMap.rightArmHp.maxValue}
          min={0}
          value={limbsHp.rightArmHp}
        />
      </View>
      <Image source={pipboy} style={styles.img} />
      <View style={styles.torsoContainer}>
        <ProgressionBar
          {...smallBarProps}
          max={limbsMap.leftTorsoHp.maxValue}
          min={0}
          value={limbsHp.leftTorsoHp}
        />
        <ProgressionBar
          {...smallBarProps}
          max={limbsMap.rightTorsoHp.maxValue}
          min={0}
          value={limbsHp.rightTorsoHp}
        />
      </View>

      <View style={styles.legsContainer}>
        <ProgressionBar
          {...smallBarProps}
          max={limbsMap.leftLegHp.maxValue}
          min={0}
          value={limbsHp.leftLegHp}
        />
        <ProgressionBar
          {...smallBarProps}
          max={limbsMap.rightLegHp.maxValue}
          min={0}
          value={limbsHp.rightLegHp}
        />
      </View>
      <Spacer y={5} />
      <ProgressionBar
        {...smallBarProps}
        max={limbsMap.groinHp.maxValue}
        min={0}
        value={limbsHp.groinHp}
      />
    </View>
  )
}
