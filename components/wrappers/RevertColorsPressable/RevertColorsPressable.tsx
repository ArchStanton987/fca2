import React, { ReactElement, ReactNode } from "react"
import { Pressable, PressableProps, StyleSheet } from "react-native"

import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"

import colors from "styles/colors"

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: colors.secColor,
    padding: 16
  },
  pressed: {
    backgroundColor: colors.secColor,
    borderColor: colors.primColor
  }
})

export interface AnimColor {
  initAnimColor?: string
  endAnimColor?: string
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export default function RevertColorsPressable(
  { children, style, ...rest }: PressableProps,
  { initAnimColor = colors.primColor, endAnimColor = colors.secColor }: AnimColor
) {
  const backgroundColor = useSharedValue(initAnimColor)

  const [isPressed, setIsPressed] = React.useState(false)

  const onPressIn = () => {
    backgroundColor.value = withTiming(endAnimColor, { duration: 200 })
    setIsPressed(true)
  }

  const onPressOut = () => {
    backgroundColor.value = withTiming(initAnimColor, { duration: 200 })
    setIsPressed(false)
  }

  const buttonStyle = useAnimatedStyle(() => ({
    backgroundColor: backgroundColor.value
  }))

  const processChildren = (child: React.ReactNode): React.ReactNode => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as ReactElement, {
        isPressed,
        children: React.Children.map(child.props.children, processChildren)
      })
    }

    return child
  }

  const processedChildren = React.Children.map(children as ReactNode, processChildren)

  return (
    <AnimatedPressable
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={[styles.container, buttonStyle, style]}
      {...rest}
    >
      {processedChildren}
    </AnimatedPressable>
  )
}
