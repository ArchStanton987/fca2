/* eslint-disable import/prefer-default-export */
import { Dimensions, Platform } from "react-native"

import { useSafeAreaInsets } from "react-native-safe-area-context"

import layout from "styles/layout"

export const useSlideWidth = () => {
  const { left, right } = useSafeAreaInsets()
  const { width } = Dimensions.get("screen")
  const slideWidth = width - layout.drawerWidth - layout.globalPadding - left - right
  return Platform.OS === "web" ? slideWidth - 6 : slideWidth
}
