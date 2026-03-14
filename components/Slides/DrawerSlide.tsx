import { View } from "react-native"

import { useSlideWidth } from "./slide.utils"

export default function DrawerSlide({ children }: { children: React.ReactNode }) {
  const slideWidth = useSlideWidth()

  return <View style={{ width: slideWidth, flexDirection: "row" }}>{children}</View>
}
