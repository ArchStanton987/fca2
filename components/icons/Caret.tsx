import { AntDesign } from "@expo/vector-icons"

import colors from "styles/colors"

type CaretProps = {
  direction: "up" | "down"
  isVisible: boolean
}

export default function Caret({ isVisible, direction }: CaretProps) {
  return (
    <AntDesign
      name={direction === "up" ? "caretup" : "caretdown"}
      size={6}
      color={isVisible ? colors.secColor : "transparent"}
    />
  )
}
