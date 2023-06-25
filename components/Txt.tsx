import { Text, TextProps } from "react-native"

import Animated, { useAnimatedStyle, useDerivedValue, withTiming } from "react-native-reanimated"

import colors from "styles/colors"
import typos from "styles/typos"

interface TxtProps extends TextProps {
  isPressable?: boolean
  isPressed?: boolean
  initAnimColor?: string
  endAnimColor?: string
}

export default function Txt({
  children,
  style,
  isPressable = true,
  isPressed,
  initAnimColor = colors.secColor,
  endAnimColor = colors.primColor,
  ...rest
}: TxtProps) {
  const textColor = useDerivedValue(() =>
    isPressed
      ? withTiming(endAnimColor, { duration: 200 })
      : withTiming(initAnimColor, { duration: 200 })
  )

  const textAnimatedStyle = useAnimatedStyle(() => ({
    color: textColor.value
  }))

  if (isPressable) {
    return (
      <Animated.Text
        style={[{ fontFamily: typos.monofonto, color: colors.secColor }, textAnimatedStyle, style]}
        {...rest}
      >
        {children}
      </Animated.Text>
    )
  }

  return (
    <Text style={[{ fontFamily: typos.monofonto, color: colors.secColor }, style]} {...rest}>
      {children}
    </Text>
  )
}
