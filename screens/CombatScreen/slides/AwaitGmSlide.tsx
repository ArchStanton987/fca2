import { ActivityIndicator } from "react-native"

import Section from "components/Section"
import DrawerSlide from "components/Slides/DrawerSlide"
import Spacer from "components/Spacer"
import Txt from "components/Txt"
import colors from "styles/colors"

type AwaitGmSlideProps = {
  messageCase: "difficulty" | "damage"
}

export default function AwaitGmSlide({ messageCase }: AwaitGmSlideProps) {
  const message =
    messageCase === "difficulty"
      ? "Le MJ doit déterminer la difficulté de votre action..."
      : "Le MJ est en train d'appliquer des dégâts..."

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
        <Txt>{message}</Txt>
      </Section>
    </DrawerSlide>
  )
}
