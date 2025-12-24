import { View, useWindowDimensions } from "react-native"

import { getSlideWidth } from "./slide.utils"

export default function DrawerSlide({ children }: { children: React.ReactNode }) {
  const { width } = useWindowDimensions()

  const slideWidth = getSlideWidth(width)

  return <View style={{ width: slideWidth, flexDirection: "row" }}>{children}</View>
}
