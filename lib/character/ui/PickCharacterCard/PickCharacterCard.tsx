import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from "react-native"

import { useCharInfo } from "lib/character/info/info-provider"
import { useExp } from "lib/character/progress/exp-provider"

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
  const { data: exp } = useExp(charId)
  const { data: fullname } = useCharInfo(charId, data => data.fullname)

  return (
    <TouchableOpacity style={styles.container} {...rest}>
      <Txt>{fullname}</Txt>
      <Spacer y={15} />
      <Txt>exp: {exp}</Txt>
    </TouchableOpacity>
  )
}
