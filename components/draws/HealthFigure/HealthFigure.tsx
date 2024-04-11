import React from "react"
import { Image, TouchableOpacity, View } from "react-native"

import { router } from "expo-router"

import { limbsMap } from "lib/character/health/health"
import { HealthStatusId } from "lib/character/health/health-types"

import pipboy from "assets/images/pipboy.png"
import ProgressionBar from "components/ProgressionBar/ProgressionBar"
import Spacer from "components/Spacer"
import routes from "constants/routes"
import { useCharacter } from "contexts/CharacterContext"
import { useSquad } from "contexts/SquadContext"

import styles from "./HealthFigure.styles"

const smallBarProps = {
  height: 5,
  width: 30
}

export default function HealthFigure() {
  const { squadId } = useSquad()
  const { health, charId } = useCharacter()
  const { limbsHp } = health

  const onPressElement = (element: HealthStatusId) => {
    const pathname = routes.modal.updateHealth
    const params = { initElement: element, charId, squadId }
    router.push({ pathname, params })
  }

  return (
    <View style={{ alignItems: "center" }}>
      <TouchableOpacity onPress={() => onPressElement("headHp")}>
        <ProgressionBar
          max={limbsMap.headHp.maxValue}
          min={0}
          value={limbsHp.headHp}
          {...smallBarProps}
        />
      </TouchableOpacity>
      <Spacer y={5} />
      <View style={styles.armsContainer}>
        <TouchableOpacity onPress={() => onPressElement("leftArmHp")}>
          <ProgressionBar
            {...smallBarProps}
            max={limbsMap.leftArmHp.maxValue}
            min={0}
            value={limbsHp.leftArmHp}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onPressElement("rightArmHp")}>
          <ProgressionBar
            {...smallBarProps}
            max={limbsMap.rightArmHp.maxValue}
            min={0}
            value={limbsHp.rightArmHp}
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => onPressElement("leftTorsoHp")}>
        <Image source={pipboy} style={styles.img} />
      </TouchableOpacity>
      <View style={styles.torsoContainer}>
        <TouchableOpacity onPress={() => onPressElement("leftTorsoHp")}>
          <ProgressionBar
            {...smallBarProps}
            max={limbsMap.leftTorsoHp.maxValue}
            min={0}
            value={limbsHp.leftTorsoHp}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onPressElement("rightTorsoHp")}>
          <ProgressionBar
            {...smallBarProps}
            max={limbsMap.rightTorsoHp.maxValue}
            min={0}
            value={limbsHp.rightTorsoHp}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.legsContainer}>
        <TouchableOpacity onPress={() => onPressElement("leftLegHp")}>
          <ProgressionBar
            {...smallBarProps}
            max={limbsMap.leftLegHp.maxValue}
            min={0}
            value={limbsHp.leftLegHp}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onPressElement("rightLegHp")}>
          <ProgressionBar
            {...smallBarProps}
            max={limbsMap.rightLegHp.maxValue}
            min={0}
            value={limbsHp.rightLegHp}
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
        />
      </TouchableOpacity>
    </View>
  )
}
