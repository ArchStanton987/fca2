import { View } from "react-native"

import { router } from "expo-router"

import Spacer from "components/Spacer"
import Txt from "components/Txt"
import colors from "styles/colors"

export default function ErrorUi() {
  const toHome = () => {
    router.push("/")
  }
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.secColor
      }}
    >
      <Txt style={{ color: colors.primColor }}>Oups ! </Txt>
      <Spacer y={50} />
      <Txt style={{ color: colors.primColor }} onPress={toHome}>
        Home
      </Txt>
    </View>
  )
}
