import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from "react-native"

import { useSuspenseQuery } from "@tanstack/react-query"
import { getCharInfoOptions } from "lib/character/info/info-provider"
import { getExpOptions } from "lib/character/progress/progress-provider"

import Spacer from "components/Spacer"
import Txt from "components/Txt"

type PickCharacterCardProps = TouchableOpacityProps & {
  charId: string
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    maxWidth: 160,
    alignItems: "center",
    justifyContent: "space-between"
  }
})

export default function PickCharacterCard({ charId, ...rest }: PickCharacterCardProps) {
  const expReq = useSuspenseQuery(getExpOptions(charId))
  const infoReq = useSuspenseQuery({ ...getCharInfoOptions(charId), select: data => data.fullname })

  return (
    <TouchableOpacity style={styles.container} {...rest}>
      <Txt>{infoReq.data}</Txt>
      <Spacer y={15} />
      <Txt>exp: {expReq.data}</Txt>
    </TouchableOpacity>
  )
}
