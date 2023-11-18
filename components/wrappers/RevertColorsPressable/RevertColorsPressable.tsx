import React, { Attributes, ReactElement, ReactNode } from "react"
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

export interface AnimColor extends PressableProps {
  initAnimColor?: string
  endAnimColor?: string
}

// function recursiveCloneChildren(children: ReactElement, newProps: any) {
//   return React.Children.map(children, (child: React.ReactElement) => {
//     if (!React.isValidElement(child)) return child

//     const childProps: ReactElement = {}
//     // Eg. String has no props
//     if (child.props.children) {
//       childProps.children = recursiveCloneChildren(child.props.children as ReactElement, newProps)
//       // child.props.children = recursiveCloneChildren(child.props.children, newProps)
//       return React.cloneElement(child as ReactElement, newProps)
//     }
//     return child
//   })
// }

// GPT
// Recursive cloning function
const recursiveCloneWithProps = (
  children: ReactNode,
  newProps: (Partial<any> & Attributes) | undefined
): ReactNode => {
  const cloneChildren = (child: ReactNode): ReactNode => {
    if (React.isValidElement(child) && child.type === "Text") {
      // Clone the element and add the new props while preserving the previous ones
      return React.cloneElement(child as ReactElement, {
        ...child.props,
        ...newProps,
        children: recursiveCloneWithProps(child.props.children, newProps)
      })
    }

    if (Array.isArray(child)) {
      // Recursively clone children if the child is an array
      return child.map(cloneChildren)
    }

    return child
  }

  return cloneChildren(children)
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export default function RevertColorsPressable({
  children,
  style,
  initAnimColor = colors.primColor,
  endAnimColor = colors.secColor,
  ...rest
}: AnimColor) {
  const backgroundColor = useSharedValue(initAnimColor)

  // const [isPressed, setIsPressed] = React.useState(false)

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

  // const processedChildren = React.Children.map(children as ReactNode, processChildren)

  return (
    <AnimatedPressable
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={[styles.container, buttonStyle, style]}
      {...rest}
    >
      {/* {processedChildren} */}
      {/* {({ pressed }) => recursiveCloneChildren(children as ReactElement, { isPressed: pressed })} */}
      {({ pressed }) => recursiveCloneWithProps(children as ReactElement, { isPressed: pressed })}
    </AnimatedPressable>
  )
}
