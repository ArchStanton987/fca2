import { View, ViewProps } from "react-native"

export default function Col({ style, ...rest }: ViewProps) {
  return <View style={[style, { flexDirection: "column" }]} {...rest} />
}
