import { ActivityIndicator, View } from "react-native"

import DrawerPage from "components/DrawerPage"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import colors from "styles/colors"

export default function WaitInitiativeScreen() {
  return (
    <DrawerPage>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.secColor} />
        <Spacer y={40} />
        <Txt>En attente des jets d&apos;initiative des autres joueurs...</Txt>
      </View>
    </DrawerPage>
  )
}
