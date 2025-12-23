import { StyleSheet } from "react-native"

import { getVersion } from "lib/common/utils/expo-utils"

import Spacer from "components/Spacer"
import Txt from "components/Txt"
import typos from "styles/typos"

const styles = StyleSheet.create({
  title: {
    fontFamily: typos.jukebox,
    fontSize: 70,
    textAlign: "center"
  },
  text: {
    fontSize: 18,
    textAlign: "center"
  },
  version: {
    fontSize: 8,
    textAlign: "center"
  }
})

export default function WelcomeHeader({ message }: { message: string }) {
  return (
    <>
      <Spacer y={30} />
      <Txt style={styles.title}>
        {"<"}Fallout Companion App{">"}
      </Txt>
      <Txt style={styles.version}>{getVersion()}</Txt>
      <Spacer y={20} />
      <Txt style={styles.text}>Bienvenue !</Txt>
      <Spacer y={10} />
      <Txt style={styles.text}>{message}</Txt>
      <Spacer y={20} />
    </>
  )
}
