import { View, ViewProps } from "react-native"

interface SpacerProps extends ViewProps {
  x?: number
  y?: number
  fullspace?: boolean
}

export default function Spacer({ x = 0, y = 0, fullspace = false, style }: SpacerProps) {
  return <View style={[{ width: x, height: y }, fullspace && { flex: 1 }, style]} />
}
