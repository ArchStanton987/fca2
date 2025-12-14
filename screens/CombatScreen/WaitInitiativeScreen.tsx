import { ActivityIndicator } from "react-native"

import DrawerPage from "components/DrawerPage"
import Section from "components/Section"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import colors from "styles/colors"

export default function WaitInitiativeScreen() {
  return (
    <DrawerPage>
      <Section
        style={{ flex: 1 }}
        contentContainerStyle={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Txt>En attente des jets d&apos;initiative des autres joueurs...</Txt>
        <Spacer y={40} />
        <ActivityIndicator size="large" color={colors.secColor} />
      </Section>
    </DrawerPage>
  )
}
