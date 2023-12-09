import React from "react"
import { ActivityIndicator, Image, View } from "react-native"

import { useLocalSearchParams } from "expo-router"

import pipboy from "assets/images/pipboy.png"
import { DrawerParams } from "components/Drawer/Drawer.params"
import ProgressionBar from "components/ProgressionBar/ProgressionBar"
import Spacer from "components/Spacer"
import useGetStatus from "hooks/db/useGetStatus"
import healthMap from "models/character/health/health"
import { SearchParams } from "screens/ScreenParams"
import colors from "styles/colors"

import styles from "./HealthFigure.styles"

const smallBarProps = {
  height: 5,
  width: 30
}

export default function HealthFigure() {
  const { charId } = useLocalSearchParams() as SearchParams<DrawerParams>
  const status = useGetStatus(charId)

  if (status === null) return <ActivityIndicator color={colors.secColor} />

  return (
    <View style={{ alignItems: "center" }}>
      <ProgressionBar
        max={healthMap.headHp.maxValue}
        min={healthMap.headHp.minValue}
        value={status.headHp}
        {...smallBarProps}
      />
      <Spacer y={5} />
      <View style={styles.armsContainer}>
        <ProgressionBar
          {...smallBarProps}
          max={healthMap.leftArmHp.maxValue}
          min={healthMap.leftArmHp.minValue}
          value={status.leftArmHp}
        />
        <ProgressionBar
          {...smallBarProps}
          max={healthMap.rightArmHp.maxValue}
          min={healthMap.rightArmHp.minValue}
          value={status.rightArmHp}
        />
      </View>
      <Image source={pipboy} style={styles.img} />
      <View style={styles.torsoContainer}>
        <ProgressionBar
          {...smallBarProps}
          max={healthMap.leftTorsoHp.maxValue}
          min={healthMap.leftTorsoHp.minValue}
          value={status.leftTorsoHp}
        />
        <ProgressionBar
          {...smallBarProps}
          max={healthMap.rightTorsoHp.maxValue}
          min={healthMap.rightTorsoHp.minValue}
          value={status.rightTorsoHp}
        />
      </View>

      <View style={styles.legsContainer}>
        <ProgressionBar
          {...smallBarProps}
          max={healthMap.leftLegHp.maxValue}
          min={healthMap.leftLegHp.minValue}
          value={status.leftLegHp}
        />
        <ProgressionBar
          {...smallBarProps}
          max={healthMap.rightLegHp.maxValue}
          min={healthMap.rightLegHp.minValue}
          value={status.rightLegHp}
        />
      </View>
      <Spacer y={5} />
      <ProgressionBar
        {...smallBarProps}
        max={healthMap.groinHp.maxValue}
        min={healthMap.groinHp.minValue}
        value={status.groinHp}
      />
    </View>
  )
}
