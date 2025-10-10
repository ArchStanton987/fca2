import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from "react-native"

import Txt from "components/Txt"
import { getDDMMYYYY } from "utils/date"

import { useSquad } from "../use-cases/sub-squad"

type PickSquadCardProps = TouchableOpacityProps & {
  squadId: string
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    padding: 10,
    marginHorizontal: 50
  },
  squadLabel: {
    textAlign: "center"
  }
})

export default function PickSquadCard({ squadId, ...rest }: PickSquadCardProps) {
  const { data: squad } = useSquad(squadId)
  return (
    <TouchableOpacity style={styles.container} {...rest}>
      <Txt style={styles.squadLabel}>{squad.label}</Txt>
      <Txt style={styles.squadLabel}>{getDDMMYYYY(squad.datetime)}</Txt>
    </TouchableOpacity>
  )
}
