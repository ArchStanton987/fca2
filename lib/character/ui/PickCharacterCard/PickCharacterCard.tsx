import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from "react-native"

import { useSuspenseQuery } from "@tanstack/react-query"
import { getCharInfoOptions } from "lib/character/info/info-provider"
import { getExpOptions } from "lib/character/progress/exp-provider"

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
  const { data: exp } = useSuspenseQuery(getExpOptions(charId))
  const { data: fullname } = useSuspenseQuery({
    ...getCharInfoOptions(charId),
    select: data => data.fullname
  })

  return (
    <TouchableOpacity style={styles.container} {...rest}>
      <Txt>{fullname}</Txt>
      <Spacer y={15} />
      <Txt>exp: {exp}</Txt>
    </TouchableOpacity>
  )
}
