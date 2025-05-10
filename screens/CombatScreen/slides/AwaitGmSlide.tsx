import { ActivityIndicator } from "react-native"

import Section from "components/Section"
import DrawerSlide from "components/Slides/DrawerSlide"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import colors from "styles/colors"

export default function AwaitGmSlide() {
  return (
    <DrawerSlide>
      <Section
        style={{ flex: 1 }}
        contentContainerStyle={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        <Txt>En attente du MJ</Txt>
        <Spacer y={30} />
        <ActivityIndicator size="large" color={colors.secColor} />
        <Spacer y={30} />
        <Txt>Le MJ doit déterminer la difficulté de votre action...</Txt>
      </Section>
    </DrawerSlide>
  )
}
