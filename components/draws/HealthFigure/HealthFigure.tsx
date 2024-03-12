import React from "react"
import { ActivityIndicator, Image, View } from "react-native"

import { useLocalSearchParams } from "expo-router"

import { limbsMap } from "lib/character/health/health"

import pipboy from "assets/images/pipboy.png"
import { DrawerParams } from "components/Drawer/Drawer.params"
import ProgressionBar from "components/ProgressionBar/ProgressionBar"
import Spacer from "components/Spacer"
import useGetStatus from "hooks/db/useGetStatus"
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
        max={limbsMap.headHp.maxValue}
        min={0}
        value={status.headHp}
        {...smallBarProps}
      />
      <Spacer y={5} />
      <View style={styles.armsContainer}>
        <ProgressionBar
          {...smallBarProps}
          max={limbsMap.leftArmHp.maxValue}
          min={0}
          value={status.leftArmHp}
        />
        <ProgressionBar
          {...smallBarProps}
          max={limbsMap.rightArmHp.maxValue}
          min={0}
          value={status.rightArmHp}
        />
      </View>
      <Image source={pipboy} style={styles.img} />
      <View style={styles.torsoContainer}>
        <ProgressionBar
          {...smallBarProps}
          max={limbsMap.leftTorsoHp.maxValue}
          min={0}
          value={status.leftTorsoHp}
        />
        <ProgressionBar
          {...smallBarProps}
          max={limbsMap.rightTorsoHp.maxValue}
          min={0}
          value={status.rightTorsoHp}
        />
      </View>

      <View style={styles.legsContainer}>
        <ProgressionBar
          {...smallBarProps}
          max={limbsMap.leftLegHp.maxValue}
          min={0}
          value={status.leftLegHp}
        />
        <ProgressionBar
          {...smallBarProps}
          max={limbsMap.rightLegHp.maxValue}
          min={0}
          value={status.rightLegHp}
        />
      </View>
      <Spacer y={5} />
      <ProgressionBar
        {...smallBarProps}
        max={limbsMap.groinHp.maxValue}
        min={0}
        value={status.groinHp}
      />
    </View>
  )
}
