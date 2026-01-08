import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from "react-native"

import { useQuery } from "@tanstack/react-query"
import { getCharInfoOptions } from "lib/character/info/info-provider"
import { getExpOptions } from "lib/character/progress/exp-provider"

import Spacer from "components/Spacer"
import Txt from "components/Txt"
import colors from "styles/colors"

type PickCharacterCardProps = TouchableOpacityProps & {
  charId: string
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    maxWidth: 160,
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 2,
    width: 150,
    borderColor: colors.secColor
  }
})

export default function PickCharacterCard({ charId, ...rest }: PickCharacterCardProps) {
  const exp = useQuery(getExpOptions(charId))
  const info = useQuery(getCharInfoOptions(charId))

  return (
    <TouchableOpacity style={styles.container} {...rest}>
      <Txt>{info?.data?.fullname ?? ""}</Txt>
      <Spacer y={15} />
      <Txt>exp: {exp.data ?? 0}</Txt>
    </TouchableOpacity>
  )
}
