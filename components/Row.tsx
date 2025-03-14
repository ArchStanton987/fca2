import { View, ViewProps } from "react-native"

export default function Row({ style, ...rest }: ViewProps) {
  return <View style={[style, { flexDirection: "row" }]} {...rest} />
}
