import React from "react"
import { Pressable, PressableProps, StyleProp, ViewStyle } from "react-native"

import { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"

import colors from "styles/colors"

import styles from "./Bttn.styles"

type BttnProps = PressableProps & {
  initAnimColor?: string
  endAnimColor?: string
  style?: StyleProp<ViewStyle>
}

export default function Bttn({
  children,
  style,
  initAnimColor = colors.primColor,
  endAnimColor = colors.secColor,
  ...rest
}: BttnProps) {
  const backgroundColor = useSharedValue(initAnimColor)

  const onPressIn = () => {
    backgroundColor.value = withTiming(endAnimColor, { duration: 200 })
    // setIsPressed(true)
  }

  const onPressOut = () => {
    backgroundColor.value = withTiming(initAnimColor, { duration: 200 })
    // setIsPressed(false)
  }

  const buttonStyle = useAnimatedStyle(() => ({
    backgroundColor: backgroundColor.value
  }))

  return (
    <Pressable
      style={[styles.container, style, buttonStyle]}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      {...rest}
    >
      {/* {({ pressed }) => children} */}
      {children}
    </Pressable>
  )
}
