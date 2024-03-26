import { Button, View } from "react-native"

import { router } from "expo-router"

import Txt from "components/Txt"
import colors from "styles/colors"

export default function UpdateEffectsModal() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.primColor }}>
      <Button title="close" onPress={() => router.back()} />
      <Txt>update effects</Txt>
    </View>
  )
}
