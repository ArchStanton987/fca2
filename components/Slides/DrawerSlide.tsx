import { View, useWindowDimensions } from "react-native"

import layout from "styles/layout"

export default function DrawerSlide({ children }: { children: React.ReactNode }) {
  const { width } = useWindowDimensions()

  const slideWidth = width - layout.drawerWidth - layout.globalPadding * 3

  return <View style={{ width: slideWidth, flexDirection: "row" }}>{children}</View>
}
