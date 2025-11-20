import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from "react-native"

import Txt from "components/Txt"
import colors from "styles/colors"
import { getDDMMYYYY } from "utils/date"

type PickSquadCardProps = TouchableOpacityProps & {
  label: string
  datetime: Date
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    padding: 10,
    marginHorizontal: 50,
    borderWidth: 2,
    borderColor: colors.secColor
  },
  squadLabel: {
    textAlign: "center"
  }
})

export default function PickSquadCard({ label, datetime, ...rest }: PickSquadCardProps) {
  return (
    <TouchableOpacity style={styles.container} {...rest}>
      <Txt style={styles.squadLabel}>{label}</Txt>
      <Txt style={styles.squadLabel}>{getDDMMYYYY(datetime)}</Txt>
    </TouchableOpacity>
  )
}
