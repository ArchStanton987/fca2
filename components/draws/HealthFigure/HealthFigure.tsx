import React from "react"
import { Image, TouchableOpacity, View } from "react-native"

import { limbsMap } from "lib/character/health/health"
import { HealthStatusId } from "lib/character/health/health-types"
import { CharBottomTabScreenProps } from "nav/nav.types"

import pipboy from "assets/images/pipboy.png"
import ProgressionBar from "components/ProgressionBar/ProgressionBar"
import Spacer from "components/Spacer"
import { useCharacter } from "contexts/CharacterContext"
import colors from "styles/colors"

import styles from "./HealthFigure.styles"

const smallBarProps = { height: 5, width: 30 }

export default function HealthFigure({ navigation }: CharBottomTabScreenProps<"Résumé">) {
  const { health } = useCharacter()
  const { limbsHp } = health

  const onPressElement = (element: HealthStatusId) => {
    navigation.push("UpdateHealth", { initElement: element })
  }

  const getProgressionBarColor = (value: number, maxValue: number) => {
    const currHpPercent = (value / maxValue) * 100
    if (value <= 0) return colors.red
    if (currHpPercent < 25) return colors.orange
    if (currHpPercent < 50) return colors.yellow
    return colors.secColor
  }

  return (
    <View style={{ alignItems: "center" }}>
      <TouchableOpacity onPress={() => onPressElement("headHp")}>
        <ProgressionBar
          max={limbsMap.headHp.maxValue}
          min={0}
          value={limbsHp.headHp}
          color={getProgressionBarColor(limbsHp.headHp, limbsMap.headHp.maxValue)}
          {...smallBarProps}
        />
      </TouchableOpacity>
      <Spacer y={5} />
      <View style={styles.armsContainer}>
        <TouchableOpacity onPress={() => onPressElement("rightArmHp")}>
          <ProgressionBar
            {...smallBarProps}
            max={limbsMap.rightArmHp.maxValue}
            min={0}
            value={limbsHp.rightArmHp}
            color={getProgressionBarColor(limbsHp.rightArmHp, limbsMap.rightArmHp.maxValue)}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onPressElement("leftArmHp")}>
          <ProgressionBar
            {...smallBarProps}
            max={limbsMap.leftArmHp.maxValue}
            min={0}
            value={limbsHp.leftArmHp}
            color={getProgressionBarColor(limbsHp.leftArmHp, limbsMap.leftArmHp.maxValue)}
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => onPressElement("leftTorsoHp")}>
        <Image source={pipboy} style={styles.img} />
      </TouchableOpacity>
      <View style={styles.torsoContainer}>
        <TouchableOpacity onPress={() => onPressElement("rightTorsoHp")}>
          <ProgressionBar
            {...smallBarProps}
            max={limbsMap.rightTorsoHp.maxValue}
            min={0}
            value={limbsHp.rightTorsoHp}
            color={getProgressionBarColor(limbsHp.rightTorsoHp, limbsMap.rightTorsoHp.maxValue)}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onPressElement("leftTorsoHp")}>
          <ProgressionBar
            {...smallBarProps}
            max={limbsMap.leftTorsoHp.maxValue}
            min={0}
            value={limbsHp.leftTorsoHp}
            color={getProgressionBarColor(limbsHp.leftTorsoHp, limbsMap.leftTorsoHp.maxValue)}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.legsContainer}>
        <TouchableOpacity onPress={() => onPressElement("rightLegHp")}>
          <ProgressionBar
            {...smallBarProps}
            max={limbsMap.rightLegHp.maxValue}
            min={0}
            value={limbsHp.rightLegHp}
            color={getProgressionBarColor(limbsHp.rightLegHp, limbsMap.rightLegHp.maxValue)}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onPressElement("leftLegHp")}>
          <ProgressionBar
            {...smallBarProps}
            max={limbsMap.leftLegHp.maxValue}
            min={0}
            value={limbsHp.leftLegHp}
            color={getProgressionBarColor(limbsHp.leftLegHp, limbsMap.leftLegHp.maxValue)}
          />
        </TouchableOpacity>
      </View>
      <Spacer y={5} />
      <TouchableOpacity onPress={() => onPressElement("groinHp")}>
        <ProgressionBar
          {...smallBarProps}
          max={limbsMap.groinHp.maxValue}
          min={0}
          value={limbsHp.groinHp}
          color={getProgressionBarColor(limbsHp.groinHp, limbsMap.groinHp.maxValue)}
        />
      </TouchableOpacity>
    </View>
  )
}
